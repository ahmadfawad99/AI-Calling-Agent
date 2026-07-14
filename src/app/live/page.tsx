"use client";

import { useState, useEffect, useRef } from "react";

export default function LivePanelPage() {
  const [callActive, setCallActive] = useState(false);
  const [transcript, setTranscript] = useState<{speaker: string, text: string}[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.lang === "en-US");
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setUserInput(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Simulate initial call flow
  useEffect(() => {
    if (!callActive) {
      window.speechSynthesis.cancel();
      return;
    }
    
    setTranscript([{ speaker: "System", text: "Connecting to agent..." }]);
    
    let timer1 = setTimeout(() => {
      const text = "Hi, this is Alex from Quantify. How can I help you today?";
      setTranscript(prev => [...prev, { speaker: "Agent", text }]);
      speak(text);
    }, 2000);

    let timer2 = setTimeout(() => {
      setTranscript(prev => [...prev, { speaker: "User", text: "Hi Alex, I was wondering if I could get a demo." }]);
    }, 5000);

    let timer3 = setTimeout(() => {
      const text = "Absolutely! I can schedule a demo for you. Does tomorrow at 2 PM work?";
      setTranscript(prev => [...prev, { speaker: "Agent", text }]);
      speak(text);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.speechSynthesis.cancel();
    };
  }, [callActive]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const toggleCall = () => {
    if (callActive) {
      setCallActive(false);
      setTranscript([]);
      setUserInput("");
      setIsRecording(false);
    } else {
      setCallActive(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !callActive) return;

    setTranscript(prev => [...prev, { speaker: "User", text: userInput }]);
    setUserInput("");

    // Simulate Agent processing the user's manual input
    setTimeout(() => {
      const text = "Perfect! I've scheduled your demo and sent a calendar invite. Is there anything else I can assist you with today?";
      setTranscript(prev => [...prev, { speaker: "Agent", text }]);
      speak(text);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Live Panel</h2>
          <p className="text-neutral-400">Test your AI agents in real-time right from the browser.</p>
        </div>
        <div className="flex gap-4 items-center">
          <select className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
            <option>Alex (Outbound Sales)</option>
            <option>Sarah (Inbound Support)</option>
          </select>
          <button 
            onClick={toggleCall}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              callActive 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {callActive ? 'End Call' : 'Start Call'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-0">
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
            <h3 className="font-medium text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${callActive ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`}></span>
              Live Transcript
            </h3>
            <span className="text-sm font-mono text-neutral-400">
              {callActive ? '00:00:12' : '00:00:00'}
            </span>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {!callActive && transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                  <span className="text-2xl">🎤</span>
                </div>
                <p>Click "Start Call" to test the agent</p>
                <p className="text-xs mt-2 text-neutral-600">Make sure your volume is turned up!</p>
              </div>
            ) : (
              <>
                {transcript.map((line, idx) => (
                  <div key={idx} className={`flex flex-col ${line.speaker === 'User' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-neutral-500 mb-1 ml-1">{line.speaker}</span>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      line.speaker === 'System' ? 'bg-neutral-800/50 text-neutral-400 text-center w-full max-w-full rounded-lg' :
                      line.speaker === 'User' ? 'bg-blue-600 text-white rounded-br-none' : 
                      'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700'
                    }`}>
                      {line.text}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </>
            )}
          </div>
          
          {callActive && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-950">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <button 
                  type="button" 
                  onClick={startRecording}
                  className={`p-3 rounded-lg border transition-colors ${
                    isRecording 
                      ? 'bg-red-900/30 border-red-800/50 text-red-500 animate-pulse' 
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white'
                  }`}
                  title="Speak"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={isRecording ? "Listening..." : "Type or speak your response..."}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit">
          <h3 className="font-medium text-white mb-6">Call Details</h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-neutral-500 mb-1">Agent Details</div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-sm">
                    A
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Alex</div>
                    <div className="text-xs text-neutral-400">Outbound Sales</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-400 flex justify-between mt-3 pt-3 border-t border-neutral-800">
                  <span>Provider</span>
                  <span className="text-white">VAPI (gpt-4o)</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-500 mb-1">Live Extraction</div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-2">
                {transcript.length > 2 ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">User Intent</span>
                      <span className="text-emerald-400 font-medium">Demo Request</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Sentiment</span>
                      <span className="text-blue-400">Positive</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-neutral-600 italic text-center py-2">
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
