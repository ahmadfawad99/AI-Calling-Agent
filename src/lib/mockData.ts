export const MOCK_AGENTS = [
  {
    id: "agent_1",
    name: "Alex (Outbound Sales)",
    voice: "alex",
    llm: "gpt-4o",
    status: "active",
    type: "outbound",
    callsHandled: 142
  },
  {
    id: "agent_2",
    name: "Sarah (Inbound Support)",
    voice: "sarah",
    llm: "gpt-4-turbo",
    status: "active",
    type: "inbound",
    callsHandled: 89
  },
  {
    id: "agent_3",
    name: "David (Appointment Setter)",
    voice: "david",
    llm: "gpt-3.5-turbo",
    status: "inactive",
    type: "outbound",
    callsHandled: 45
  }
];

export const MOCK_CALLS = [
  {
    id: "call_1",
    agentId: "agent_1",
    type: "outbound",
    status: "completed",
    duration: "4m 12s",
    timestamp: new Date().toISOString(),
    transcript: "Agent: Hello, this is Alex from Quantify. Am I speaking with Lucas?\nUser: Yes, speaking.\nAgent: Great! I'm calling about the AI agent platform we discussed...",
    summary: "Lucas is interested in the platform and wants a demo next week."
  },
  {
    id: "call_2",
    agentId: "agent_2",
    type: "inbound",
    status: "completed",
    duration: "2m 45s",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    transcript: "Agent: Thank you for calling Quantify support. How can I help you today?\nUser: Hi, I need help resetting my password.\nAgent: I can certainly help with that. Please check your email for a reset link.",
    summary: "User called to reset password. Link was sent."
  },
  {
    id: "call_3",
    agentId: "agent_1",
    type: "outbound",
    status: "missed",
    duration: "0s",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    transcript: "",
    summary: "No answer."
  }
];

export const MOCK_STATS = {
  activeCalls: 2,
  callsToday: 48,
  scheduledCalls: 12,
  successRate: "78%"
};
