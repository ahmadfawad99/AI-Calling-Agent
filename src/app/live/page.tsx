"use client";

import { useState, useEffect, useRef } from "react";

type TranscriptLine = { speaker: "Agent" | "User"; text: string; time: string };

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default function LivePanelPage() {
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [interimText, setInterimText] = useState("");
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);
  const agentSpeakingRef = useRef(false);
  const callActiveRef = useRef(false);

  // Call duration timer
  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callActive]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Keep refs in sync
  useEffect(() => { agentSpeakingRef.current = agentSpeaking; }, [agentSpeaking]);
  useEffect(() => { callActiveRef.current = callActive; }, [callActive]);

  // Pause/resume recognition around agent speech
  useEffect(() => {
    if (!recognitionRef.current) return;
    if (agentSpeaking) {
      try { recognitionRef.current.stop(); } catch {}
    } else if (callActiveRef.current) {
      // small delay so audio has finished
      setTimeout(() => {
        if (!recognitionRef.current || !callActiveRef.current) return;
        try { recognitionRef.current.start(); } catch {}
      }, 400);
    }
  }, [agentSpeaking]);

  // Speak using ElevenLabs API route (falls back to browser TTS)
  const speak = async (text: string) => {
    setAgentSpeaking(true);
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const contentType = res.headers.get("Content-Type") || "";
      if (contentType.includes("audio/mpeg")) {
        const arrayBuffer = await res.arrayBuffer();
        const audioCtx = new AudioContext();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        const source = audioCtx.createBufferSource();
        source.buffer = decoded;
        source.connect(audioCtx.destination);
        source.onended = () => setAgentSpeaking(false);
        source.start(0);
        return;
      }
    } catch {
      // fall through to browser TTS
    }

    // Browser TTS fallback
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes("Google US English") || v.lang === "en-US");
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => setAgentSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Initial scripted call flow + start continuous listening after agent's first line
  useEffect(() => {
    if (!callActive) {
      window.speechSynthesis.cancel();
      setAgentSpeaking(false);
      return;
    }

    const t1 = setTimeout(async () => {
      const text = "Hi, this is Alex from Quantify. How can I help you today?";
      setTranscript((prev) => [...prev, { speaker: "Agent", text, time: getTime() }]);
      await speak(text);
      // Start always-on listening right after the greeting ends
      setTimeout(() => startContinuousRecognition(), 500);
    }, 1500);

    // Scripted user line for demo feel (shows it can hear)
    const t2 = setTimeout(() => {
      setTranscript((prev) => [...prev, { speaker: "User", text: "Hi Alex, I was wondering if I could get a demo of the platform.", time: getTime() }]);
    }, 5500);

    const t3 = setTimeout(async () => {
      const text = "Absolutely! I'd love to set that up. Does tomorrow at 2 PM work for you?";
      setTranscript((prev) => [...prev, { speaker: "Agent", text, time: getTime() }]);
      await speak(text);
    }, 8000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.speechSynthesis.cancel();
      setAgentSpeaking(false);
      stopContinuousRecognition();
    };
  }, [callActive]);

  // Auto-scroll
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const toggleCall = () => {
    if (callActive) {
      stopContinuousRecognition();
      window.speechSynthesis.cancel();
      setCallActive(false);
      setTranscript([]);
      setUserInput("");
      setInterimText("");
    } else {
      setCallActive(true);
    }
  };

  // Handle what user says (auto-fired from continuous recognition)
  const handleUserSpeech = async (spokenText: string) => {
    if (!spokenText.trim() || agentSpeakingRef.current) return;
    setTranscript((prev) => [...prev, { speaker: "User", text: spokenText, time: getTime() }]);
    setInterimText("");
    setTimeout(async () => {
      const text = "Perfect! I've got that booked in. You'll receive a calendar invite shortly. Is there anything else I can help you with?";
      setTranscript((prev) => [...prev, { speaker: "Agent", text, time: getTime() }]);
      await speak(text);
    }, 1000);
  };

  // Continuous recognition — auto-start when call begins, pause when agent speaks
  const startContinuousRecognition = () => {
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      if (agentSpeakingRef.current) return; // ignore while agent speaks
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (interim) setInterimText(interim);
      if (final) {
        setInterimText("");
        handleUserSpeech(final.trim());
      }
    };
    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech" && e.error !== "aborted") setIsListening(false);
    };
    recognition.onend = () => {
      // Auto-restart as long as call is active and agent isn't speaking
      if (callActiveRef.current && !agentSpeakingRef.current) {
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
      }
    };
    try { recognition.start(); } catch {}
  };

  const stopContinuousRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
  };

  // Handle text-box send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !callActive) return;
    await handleUserSpeech(userInput);
    setUserInput("");
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-white">

      {/* Header bar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold">Live Panel</h2>
          <p className="text-sm text-neutral-400">Browser-based AI agent demo</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
            <option>Alex (Outbound Sales)</option>
            <option>Sarah (Inbound Support)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">

        {/* Left: Call UI */}
        <div className="flex flex-col flex-1 items-center justify-between py-10 px-8">

          {/* Orb + Status */}
          <div className="flex flex-col items-center gap-6">
            {/* Animated orb */}
            <div className={`relative flex items-center justify-center transition-all duration-300 ${callActive ? "w-36 h-36" : "w-28 h-28"}`}>
              {/* Pulse rings when agent speaks */}
              {agentSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="absolute inset-[-8px] rounded-full bg-blue-500/10 animate-ping" style={{ animationDelay: "150ms" }} />
                </>
              )}
              <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-bold shadow-lg transition-all duration-500 ${
                callActive
                  ? agentSpeaking
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  : "bg-neutral-800"
              }`}>
                A
              </div>
            </div>

            {/* Agent name */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">Alex</h3>
              <p className="text-sm text-neutral-400">AI Sales Agent · VAPI + ElevenLabs</p>
            </div>

            {/* Status + Timer */}
            <div className="flex items-center gap-2 text-sm">
              {callActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 font-mono">{formatDuration(callDuration)}</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400">
                    {agentSpeaking ? "Alex speaking..." : isListening ? interimText ? `"${interimText}"` : "Listening..." : "Connecting mic..."}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-neutral-600" />
                  <span className="text-neutral-500">Ready to connect</span>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-6 w-full max-w-xs">
            {/* Mute + End Call */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => setMuted((m) => !m)}
                disabled={!callActive}
                className={`flex flex-col items-center gap-2 group disabled:opacity-30`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  muted ? "bg-red-600" : "bg-neutral-800 group-hover:bg-neutral-700"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" />
                    {muted && <line x1="2" y1="2" x2="22" y2="22" />}
                  </svg>
                </div>
                <span className="text-xs text-neutral-400">{muted ? "Unmute" : "Mute"}</span>
              </button>

              {/* Main call button */}
              <button onClick={toggleCall} className={`flex flex-col items-center gap-2 group`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  callActive
                    ? "bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                    : "bg-green-600 hover:bg-green-700 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                }`}>
                  {callActive ? (
                    // Hang up icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135, 12, 12)"/>
                    </svg>
                  ) : (
                    // Phone icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-neutral-400">{callActive ? "End Call" : "Call"}</span>
              </button>

              {/* Mic status — always-on, no button needed */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  !callActive ? "bg-neutral-800 opacity-30" :
                  agentSpeaking ? "bg-neutral-800" :
                  isListening ? "bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-neutral-800"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                </div>
                <span className="text-xs text-neutral-400">
                  {!callActive ? "Mic" : agentSpeaking ? "Paused" : isListening ? "Hearing you" : "Mic"}
                </span>
              </div>
            </div>

            {/* Text input */}
            {callActive && (
              <form onSubmit={handleSend} className="w-full flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Or type your reply..."}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors">
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Live Transcript */}
        <div className="w-80 border-l border-neutral-800 flex flex-col bg-neutral-900">
          <div className="px-5 py-4 border-b border-neutral-800">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${callActive ? "bg-green-500 animate-pulse" : "bg-neutral-600"}`} />
              Live Transcript
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {!callActive && transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 9h8M8 13h5m-7 7l-4 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8z"/></svg>
                <p className="text-xs">Transcript will appear here when a call is active.</p>
              </div>
            ) : (
              transcript.map((line, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${line.speaker === "Agent" ? "text-blue-400" : "text-neutral-300"}`}>
                      {line.speaker === "Agent" ? "Alex (AI)" : "User"}
                    </span>
                    <span className="text-xs text-neutral-600 font-mono">{line.time}</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">{line.text}</p>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Live Extraction */}
          {transcript.length > 2 && (
            <div className="px-5 py-4 border-t border-neutral-800 space-y-2">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Live AI Extraction</p>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Intent</span>
                <span className="text-emerald-400 font-medium">Demo Request</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Sentiment</span>
                <span className="text-blue-400">Positive</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Next Step</span>
                <span className="text-yellow-400">Schedule</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
