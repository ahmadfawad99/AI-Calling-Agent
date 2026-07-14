"use client";

import { MOCK_AGENTS } from "@/lib/mockData";

export default function AgentsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Agents</h2>
          <p className="text-neutral-400">Configure and monitor your voice AI agents.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          + Create Agent
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MOCK_AGENTS.map((agent) => (
          <div key={agent.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  agent.status === 'active' 
                    ? 'bg-green-900/30 text-green-400 border-green-800/50' 
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {agent.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                  {agent.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Type</span>
                  <span className="text-white capitalize">{agent.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Voice ID</span>
                  <span className="text-white capitalize">{agent.voice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">LLM Engine</span>
                  <span className="text-white font-mono">{agent.llm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Calls Handled</span>
                  <span className="text-white">{agent.callsHandled}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium border border-neutral-700">
                  Edit Prompt
                </button>
                <button className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors text-sm font-medium border border-neutral-700">
                  Settings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
