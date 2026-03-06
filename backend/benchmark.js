require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/Message");

async function runBenchmark() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for benchmarking.");

    const testRoom = "PerformanceTestRoom";

    // 1. Clear existing test data
    await Message.deleteMany({ groupChatName: testRoom });

    // 2. Populate 10,000 messages
    console.log("Populating 10,000 messages...");
    const dummyMessages = [];
    for (let i = 0; i < 10000; i++) {
        dummyMessages.push({
            message: `Message number ${i}`,
            name: `User${i % 10}`,
            groupChatName: testRoom,
            time: "12:00 PM",
            createdAt: new Date(Date.now() - (10000 - i) * 1000) // Staggered timestamps
        });
    }
    await Message.insertMany(dummyMessages);
    console.log("Population complete.");

    // 3. Run Explain Query
    console.log("Running query with explain stats...");
    const stats = await Message.find({ groupChatName: testRoom })
        .sort({ createdAt: -1 })
        .limit(50)
        .explain("executionStats");

    const execTime = stats.executionStats.executionTimeMillis;
    const totalDocsExamined = stats.executionStats.totalDocsExamined;

    console.log("\n--- BENCHMARK RESULTS ---");
    console.log(`Execution Time: ${execTime}ms`);
    console.log(`Total Docs Examined: ${totalDocsExamined}`);
    console.log("-------------------------\n");

    await mongoose.disconnect();
}

runBenchmark().catch(err => console.error(err));
