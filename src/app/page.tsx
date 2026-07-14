"use client";

import { MOCK_STATS, MOCK_CALLS } from "@/lib/mockData";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
          <p className="text-neutral-400">Welcome back, Lucas. Here's your AI agent activity.</p>
        </div>
        <div className="tour-quick-actions flex gap-4">
          <Link href="/scheduler" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700">
            Schedule Campaign
          </Link>
          <Link href="/live" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
            Start Live Panel
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="tour-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Active Calls</h3>
          <div className="text-3xl font-bold text-white flex items-center gap-3">
            {MOCK_STATS.activeCalls}
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Calls Today</h3>
          <div className="text-3xl font-bold text-white">{MOCK_STATS.callsToday}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Scheduled</h3>
          <div className="text-3xl font-bold text-white">{MOCK_STATS.scheduledCalls}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Success Rate</h3>
          <div className="text-3xl font-bold text-emerald-400">{MOCK_STATS.successRate}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="tour-activity bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <Link href="/calls" className="text-sm text-blue-400 hover:text-blue-300">View all logs →</Link>
        </div>
        <div className="divide-y divide-neutral-800">
          {MOCK_CALLS.map((call) => (
            <div key={call.id} className="p-6 hover:bg-neutral-800/50 transition-colors flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    call.type === 'inbound' 
                      ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' 
                      : 'bg-purple-900/30 text-purple-400 border-purple-800/50'
                  }`}>
                    {call.type}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    call.status === 'completed' ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                    call.status === 'missed' ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
                    {call.status}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-white font-medium mb-1">{call.summary}</p>
                <p className="text-sm text-neutral-400">Agent: {call.agentId} • Duration: {call.duration}</p>
              </div>
              <Link href="/calls" className="px-4 py-2 text-sm bg-neutral-950 border border-neutral-700 hover:border-neutral-500 rounded-lg text-white transition-colors">
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
