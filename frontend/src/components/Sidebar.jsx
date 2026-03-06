import { useState, useEffect } from "react";
import { socket } from "../socket";

function Sidebar({ joinedRooms, currentRoom, onRoomSelect, onJoinNew, username }) {
    return (
        <div className="w-80 h-full glass border-r border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg brand-font">
                        {username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">{username}</h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                <button
                    onClick={onJoinNew}
                    className="w-full py-3 px-4 rounded-xl subspace-button text-sm font-semibold flex items-center justify-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Join New Room
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Your Groups</h3>

                {joinedRooms.length === 0 ? (
                    <div className="px-3 py-8 text-center text-slate-500 text-sm italic">
                        No active rooms. Join one to start chatting.
                    </div>
                ) : (
                    joinedRooms.map((room) => (
                        <button
                            key={room}
                            onClick={() => onRoomSelect(room)}
                            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 group ${currentRoom === room
                                    ? 'bg-indigo-600/20 border border-indigo-500/30'
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white transition-colors ${currentRoom === room ? 'bg-indigo-600' : 'bg-slate-700 group-hover:bg-slate-600'
                                }`}>
                                {room[0].toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-medium text-white truncate">{room}</h4>
                                <p className="text-xs text-slate-400 truncate">Tap to open chat</p>
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-500 font-medium tracking-tight">SUBSPACE CONCIERGE v1.0</p>
            </div>
        </div>
    );
}

export default Sidebar;
