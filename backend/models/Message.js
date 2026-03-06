const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    name: { type: String, required: true },
    groupChatName: { type: String, required: true },
    time: { type: String },
    isSystem: { type: Boolean, default: false },
    clientId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

MessageSchema.index({ groupChatName: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
