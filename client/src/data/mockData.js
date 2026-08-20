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

/*
 * ---------------------------------------------------------------------------
 * DEMO DATA — everything below has no backend source yet.
 * The AI pipeline (server/src/prompts/summarise.prompt.js) returns only
 * summary / priority / action / reply, and there is no calendar-read endpoint,
 * so the screens below render these fixtures and label them "Demo data".
 * ---------------------------------------------------------------------------
 */

export const IS_DEMO_DATA = true;

/** Wireframe 4b's confidence numbers, reused as a score badge on 4a cards. */
export const AI_SCORES = {
  urgent: 92,
  important: 65,
  later: 20,
};

export const SENTIMENT = {
  label: 'Positive / Professional',
  tone: 'positive',
  score: 0.72,
};

export const RELATED_THREADS = [
  { id: 'rt-1', title: 'Q3 Planning Discussion', date: 'Jun 12' },
  { id: 'rt-2', title: 'Budget Templates', date: 'May 28' },
];

export const ATTACHMENTS = [
  { id: 'att-1', name: 'Q3_Budget.xlsx', size: '248 KB' },
];

/** Wireframe 7b's "Email-Extracted Events" list. */
export const EXTRACTED_EVENTS = [
  { id: 'ex-1', title: 'Flight to Mumbai', date: 'Aug 25', source: 'Travel Itinerary email' },
  { id: 'ex-2', title: 'Invoice Due', date: 'Aug 28', source: 'Vendor payment email' },
  { id: 'ex-3', title: 'Webinar Registration', date: 'Sep 2', source: 'Conference invite' },
];

/** 7a's weekly grid. `day` is 0=Mon … 6=Sun, `hour` is 24h and must be in HOURS. */
export const WEEK_HOURS = [9, 10, 11, 12];

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WEEK_EVENTS = [
  { id: 'ev-1', day: 0, hour: 9, title: 'Team Standup', kind: 'primary', time: '9:00 – 9:30' },
  { id: 'ev-2', day: 2, hour: 9, title: 'Client Review', kind: 'important', time: '9:00 – 10:30' },
  { id: 'ev-3', day: 1, hour: 10, title: 'Design Sprint', kind: 'success', time: '10:00 – 11:00' },
  { id: 'ev-4', day: 4, hour: 10, title: '1:1 with PM', kind: 'primary', time: '10:00 – 10:45' },
  { id: 'ev-5', day: 3, hour: 12, title: 'Deadline: API spec', kind: 'urgent', time: 'All day' },
];

export const EVENT_KINDS = {
  primary: 'bg-accent-light border-l-primary text-primary',
  important: 'bg-amber-50 border-l-important text-amber-700',
  success: 'bg-emerald-50 border-l-secondary text-emerald-700',
  urgent: 'bg-red-50 border-l-urgent text-urgent',
};

/** 7a's tasks sidebar. */
export const TASKS = [
  { id: 1, text: "Reply to Aarav's proposal", priority: 'urgent', due: 'Due today', origin: 'From email' },
  { id: 2, text: 'Review budget spreadsheet', priority: 'important', due: 'Due Thu', origin: 'From email' },
  { id: 3, text: 'Send meeting notes', priority: 'later', due: 'Due Fri', origin: 'Self-created' },
  { id: 4, text: 'Follow up with Priya', priority: 'important', due: 'Due Sat', origin: 'AI suggested' },
];
