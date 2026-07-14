"use client";

import { MOCK_CALLS } from "@/lib/mockData";

export default function CallsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Call Logs</h2>
          <p className="text-neutral-400">Review past conversations, transcripts, and summaries.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Search calls..." 
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700">
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="p-4 text-sm font-medium text-neutral-400">Status</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Type</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Agent</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Duration</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Time</th>
                <th className="p-4 text-sm font-medium text-neutral-400">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {MOCK_CALLS.map((call) => (
                <tr key={call.id} className="hover:bg-neutral-800/50 transition-colors cursor-pointer group">
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      call.status === 'completed' ? 'bg-green-900/30 text-green-400 border-green-800/50' :
                      call.status === 'missed' ? 'bg-red-900/30 text-red-400 border-red-800/50' :
                      'bg-neutral-800 text-neutral-400'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      call.type === 'inbound' 
                        ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' 
                        : 'bg-purple-900/30 text-purple-400 border-purple-800/50'
                    }`}>
                      {call.type}
                    </span>
                  </td>
                  <td className="p-4 text-white text-sm">{call.agentId}</td>
                  <td className="p-4 text-neutral-400 text-sm">{call.duration}</td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {new Date(call.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-4 text-neutral-300 text-sm truncate max-w-xs group-hover:text-white">
                    {call.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
