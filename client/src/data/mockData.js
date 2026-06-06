export const MOCK_EMAILS = [
  {
    id: "1",
    sender: "Aarav Mehta",
    senderEmail: "aarav@tech.com",
    subject: "Q4 Strategy Review — final deck attached",
    snippet: "Please review slides 4-9 before our sync tomorrow morning. Key decisions on budget allocation...",
    timestamp: "9:42 AM",
    priority: "high",
    isAiBadge: true,
    initials: "AM",
    aiSummary: "Aarav shared the final Q4 strategy deck and needs your review of slides 4-9 before tomorrow's 9 AM sync. Key decisions on budget allocation are pending your approval.",
    confidence: 92,
    content: "Hi team,\n\nI wanted to follow up on our Q4 roadmap discussion from last week. We've made significant progress on the core feature set, but there are a few alignment points I'd like us to lock down before the sprint planning session on Friday.\n\nFirst, the AI summarization pipeline needs final sign-off from engineering. Second, we should confirm the calendar integration timeline so the design team can prepare the necessary flows. Lastly, please review the attached priorities document and share any concerns by EOD Thursday.\n\nLet me know if a quick call would help to align faster. Thanks for the continued effort on this.\n\nBest,\nAarav",
    thread: [
       { sender: "Aarav Mehta", content: "Hi team, I wanted to follow up on our Q4 roadmap discussion...", timestamp: "9:42 AM" }
    ]
  },
  {
    id: "2",
    sender: "Priya Nair",
    senderEmail: "priya@design.com",
    subject: "Re: Onboarding flow feedback",
    snippet: "Thanks for the quick turnaround, a couple small tweaks left. The latest prototype looks great...",
    timestamp: "8:15 AM",
    priority: "medium",
    isAiBadge: true,
    initials: "PN",
    aiSummary: "Priya provided feedback on the onboarding flow. Most issues resolved, a few small tweaks remain.",
    confidence: 88,
    content: "Hi,\n\nThanks for the quick turnaround on the onboarding flow. The latest prototype looks great! I've added a few comments regarding the transition animations on the final screen.\n\nCan we hop on a quick 5-min call later today to finalize?",
    thread: [
        { sender: "Priya Nair", content: "Thanks for the quick turnaround...", timestamp: "8:15 AM" }
    ]
  },
  {
    id: "3",
    sender: "Github",
    senderEmail: "noreply@github.com",
    subject: "[saarthimail] 3 new pull requests",
    snippet: "PR #10 ready for review - CI passed on all checks. Performance improvements and bug fixes...",
    timestamp: "Yesterday",
    priority: "medium",
    isAiBadge: false,
    initials: "GH",
    aiSummary: "Three new pull requests in the saarthimail repository. CI checks have passed.",
    confidence: 100,
    content: "New pull requests:\n#112 Fix: AI summary edge cases\n#113 Feat: Calendar integration initial UI\n#114 Refactor: Sidebar navigation",
    thread: []
  },
  {
    id: "4",
    sender: "Kavya Reddy",
    senderEmail: "kavya@billing.com",
    subject: "Invoice #2291 — payment overdue",
    snippet: "A gentle reminder that this invoice is now past its due date. Please process it at your earliest...",
    timestamp: "Yesterday",
    priority: "high",
    isAiBadge: true,
    initials: "KR",
    aiSummary: "Urgent: Payment overdue for invoice #2291. Action required: Process payment to avoid service interruption.",
    confidence: 95,
    content: "Hi,\n\nThis is a friendly reminder that invoice #2291 is now 5 days past its due date. We would appreciate it if you could process the payment at your earliest convenience.\n\nIf you have already sent the payment, please disregard this email.",
    thread: []
  },
  {
    id: "5",
    sender: "Design Weekly",
    senderEmail: "news@designweekly.com",
    subject: "5 fresh patterns for productivity UIs",
    snippet: "Curated reads on dense layouts and calm interfaces. This week we look at how to balance...",
    timestamp: "Mon",
    priority: "low",
    isAiBadge: false,
    initials: "DW",
    aiSummary: "Weekly design newsletter featuring productivity UI patterns.",
    confidence: 80,
    content: "Check out this week's top 5 design patterns for building better productivity software...",
    thread: []
  }
];

export const AI_INSIGHTS = {
  inboxInsights: "Aarav shared the final Q4 strategy deck and needs your review of slides 4-9 before tomorrow's 9 AM sync. Key decisions on budget allocation are pending your approval.",
  followUps: [
    { id: 1, text: "Review slides 4-9 for Aarav" },
    { id: 2, text: "Reply to Priya regarding onboarding tweaks" }
  ],
  suggestedActions: [
    { id: 1, text: "Add to Calendar", icon: "Calendar" },
    { id: 2, text: "Mark Important", icon: "Flag" }
  ]
};

export const CALENDAR_EVENTS = [
  { id: 1, title: "Q4 Roadmap Sync", time: "Mon, 10:00 AM", type: "event" },
  { id: 2, title: "Design Feedback", time: "Wed, 2:30 PM", type: "event" },
  { id: 3, title: "Weekly Catchup", time: "Fri, 9:15 AM", type: "event" }
];

export const TASKS = [
  { id: 1, text: "Finalize Q4 Strategy Deck", source: "Aarav Mehta" },
  { id: 2, text: "Process Invoice #2291", source: "Kavya Reddy" },
  { id: 3, text: "Review Onboarding Prototype", source: "Priya Nair" }
];
