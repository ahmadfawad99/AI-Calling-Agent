"use client";

export default function SchedulerPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Campaign Scheduler</h2>
          <p className="text-neutral-400">Schedule outbound AI calls and campaigns.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
          + Schedule Call
        </button>
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Contact Name</label>
              <input type="text" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Phone Number</label>
              <input type="tel" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000" />
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
              <input type="datetime-local" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
            </div>
            <button type="button" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium mt-4">
              Add to Schedule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
