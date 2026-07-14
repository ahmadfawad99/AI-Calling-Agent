"use client";

import { useState } from "react";

export default function SchedulerPage() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    // Simulate API call
    setTimeout(() => {
      setIsScheduling(false);
      setScheduled(true);
      // Reset after 3 seconds
      setTimeout(() => setScheduled(false), 3000);
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Campaign Scheduler</h2>
          <p className="text-neutral-400">Schedule outbound AI calls and campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Upcoming Schedule</h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-neutral-800 rounded-lg bg-neutral-950">
                <div className="w-16 text-center">
                  <div className="text-sm text-neutral-400">JUL</div>
                  <div className="text-xl font-bold text-white">{14 + i}</div>
                </div>
                <div className="w-px h-10 bg-neutral-800"></div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Follow-up: Sarah Jenkins</h4>
                  <p className="text-sm text-neutral-400">Agent: Alex (Outbound Sales) • 2:30 PM</p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-800/50 rounded-full text-xs font-medium">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit">
          <h3 className="text-xl font-bold text-white mb-6">Quick Schedule</h3>
          {scheduled ? (
            <div className="bg-green-900/30 border border-green-800/50 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                ✓
              </div>
              <h4 className="text-green-400 font-medium mb-1">Call Scheduled!</h4>
              <p className="text-sm text-green-500/70">The agent will initiate the call at the specified time.</p>
            </div>
          ) : (
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Contact Name</label>
                <input required type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Phone Number</label>
                <input required type="tel" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Select Agent</label>
                <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>Alex (Outbound Sales)</option>
                  <option>David (Appointment Setter)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Date & Time</label>
                <input required type="datetime-local" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
              </div>
              <button 
                type="submit" 
                disabled={isScheduling}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium mt-4"
              >
                {isScheduling ? "Scheduling..." : "Add to Schedule"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
