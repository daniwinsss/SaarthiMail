require("dotenv").config();

const mongoose = require("mongoose");
const applyDnsServers = require("../config/dns.js");
const connectDB = require("../config/db.js");
const Email = require("../models/email.models.js");

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL;

// Minutes ago, so the inbox always looks freshly synced whenever it is seeded.
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

const DEMO_EMAILS = [
    {
        gmailId: "demo-1",
        sender: "Aarav Mehta",
        senderEmail: "aarav@tech.com",
        subject: "Q4 Strategy Review — final deck attached",
        snippet:
            "Please review slides 4-9 before our sync tomorrow morning. Key decisions on budget allocation are still pending your approval.",
        body: "Hi team,\n\nI wanted to follow up on our Q4 roadmap discussion from last week. We've made significant progress on the core feature set, but there are a few alignment points I'd like us to lock down before the sprint planning session on Friday.\n\nFirst, the AI summarization pipeline needs final sign-off from engineering. Second, we should confirm the calendar integration timeline so the design team can prepare the necessary flows. Lastly, please review the attached priorities document and share any concerns by EOD Thursday.\n\nCan we do a 30 min sync tomorrow at 9:00 AM to close this out?\n\nBest,\nAarav",
        summary:
            "Aarav shared the final Q4 strategy deck and needs your review of slides 4-9 before tomorrow's 9 AM sync. Key decisions on budget allocation are pending your approval.",
        priority: "high",
        action: "Review slides 4-9 and confirm the 9:00 AM sync",
        reply: "Hi Aarav,\n\nThanks for pulling this together. I'll go through slides 4-9 tonight and come to the 9:00 AM sync with my notes on the budget allocation.\n\nBest,\nAlex",
        minutesAgo: 18,
    },
    {
        gmailId: "demo-2",
        sender: "Kavya Reddy",
        senderEmail: "kavya@billing.com",
        subject: "Invoice #2291 — payment overdue",
        snippet:
            "A gentle reminder that this invoice is now past its due date. Please process it at your earliest convenience.",
        body: "Hi,\n\nThis is a friendly reminder that invoice #2291 is now 5 days past its due date. We would appreciate it if you could process the payment at your earliest convenience.\n\nIf you have already sent the payment, please disregard this email.\n\nRegards,\nKavya",
        summary:
            "Invoice #2291 is 5 days overdue. Action required: process the payment to avoid a service interruption.",
        priority: "high",
        action: "Process payment for invoice #2291",
        reply: "Hi Kavya,\n\nApologies for the delay — I'm processing invoice #2291 today and will share the confirmation once it clears.\n\nThanks,\nAlex",
        minutesAgo: 95,
    },
    {
        gmailId: "demo-3",
        sender: "Priya Nair",
        senderEmail: "priya@design.com",
        subject: "Re: Onboarding flow feedback",
        snippet:
            "Thanks for the quick turnaround, a couple of small tweaks left. The latest prototype looks great.",
        body: "Hi,\n\nThanks for the quick turnaround on the onboarding flow. The latest prototype looks great! I've added a few comments regarding the transition animations on the final screen.\n\nCan we hop on a quick 5-min call later today to finalize?\n\nPriya",
        summary:
            "Priya reviewed the onboarding flow. Most issues are resolved; a few animation tweaks remain and she wants a short call today.",
        priority: "medium",
        action: "Schedule a 5-minute call with Priya",
        reply: "Hi Priya,\n\nGlad the prototype landed well. I'm free after 3 PM today for a quick call — send an invite whenever suits you.\n\nThanks,\nAlex",
        minutesAgo: 160,
    },
    {
        gmailId: "demo-4",
        sender: "Rhea Kapoor",
        senderEmail: "rhea@northwind.io",
        subject: "Contract renewal — need your sign-off by Friday",
        snippet:
            "Legal has cleared the updated terms. We just need your signature before the current contract lapses on Friday.",
        body: "Hello,\n\nOur legal team has cleared the updated terms for the annual renewal. The only outstanding item is your signature — the current agreement lapses this Friday, so we would like to wrap this up before then.\n\nI've attached the redlined version for reference. Happy to walk through the changes on a call if that is easier.\n\nBest regards,\nRhea",
        summary:
            "Northwind's contract renewal is cleared by legal and needs your signature before the agreement lapses on Friday.",
        priority: "high",
        action: "Sign the renewal contract before Friday",
        reply: "Hi Rhea,\n\nThanks for moving this through legal. I'll review the redlines and get the signed copy back to you before Friday.\n\nBest,\nAlex",
        minutesAgo: 300,
    },
    {
        gmailId: "demo-5",
        sender: "GitHub",
        senderEmail: "noreply@github.com",
        subject: "[saarthimail] 3 new pull requests",
        snippet:
            "PR #114 is ready for review — CI passed on all checks. Performance improvements and bug fixes included.",
        body: "New pull requests in daniwinsss/saarthimail:\n\n#112 Fix: AI summary edge cases\n#113 Feat: Calendar integration initial UI\n#114 Refactor: Sidebar navigation\n\nAll checks have passed.",
        summary:
            "Three new pull requests are open on the saarthimail repository and CI checks have passed on all of them.",
        priority: "medium",
        action: "Review the three open pull requests",
        reply: "",
        minutesAgo: 620,
    },
    {
        gmailId: "demo-6",
        sender: "Ishaan Verma",
        senderEmail: "ishaan@saarthimail.app",
        subject: "Standup moved to 10:30 AM tomorrow",
        snippet:
            "Quick heads up — tomorrow's standup shifts by 30 minutes so the platform team can join.",
        body: "Hey,\n\nQuick heads up: tomorrow's standup moves from 10:00 AM to 10:30 AM so the platform team can join us. Same meeting link, no other changes.\n\nSee you there,\nIshaan",
        summary:
            "Tomorrow's standup is moved to 10:30 AM so the platform team can attend. The meeting link is unchanged.",
        priority: "medium",
        action: "Update your calendar for the 10:30 AM standup",
        reply: "Thanks for the heads up, Ishaan — 10:30 AM works for me.",
        minutesAgo: 1150,
    },
    {
        gmailId: "demo-7",
        sender: "Design Weekly",
        senderEmail: "news@designweekly.com",
        subject: "5 fresh patterns for productivity UIs",
        snippet:
            "Curated reads on dense layouts and calm interfaces. This week we look at how to balance information density.",
        body: "This week's top five design patterns for building better productivity software: progressive disclosure in dense tables, calm notification design, keyboard-first navigation, inline AI affordances, and empty states that teach.\n\nRead the full issue on the web.",
        summary:
            "A weekly design newsletter covering five productivity UI patterns, including calm notifications and inline AI affordances.",
        priority: "low",
        action: "",
        reply: "",
        minutesAgo: 2600,
    },
    {
        gmailId: "demo-8",
        sender: "Cloud Billing",
        senderEmail: "billing@cloudhost.com",
        subject: "Your monthly usage report is ready",
        snippet:
            "Your usage was 12% lower than last month. No action is required on your account.",
        body: "Your monthly usage report is now available.\n\nCompute: 412 hours\nStorage: 88 GB\nEgress: 14 GB\n\nTotal spend is 12% lower than last month. No action is required.",
        summary:
            "The monthly cloud usage report is available. Spend is down 12% month over month and no action is required.",
        priority: "low",
        action: "",
        reply: "",
        minutesAgo: 4300,
    },
];

const seed = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set. Aborting.");
        process.exit(1);
    }
    if (!DEMO_EMAIL) {
        console.error("DEMO_USER_EMAIL is not set. Aborting.");
        process.exit(1);
    }

    applyDnsServers();
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
        console.error("Could not connect to MongoDB. Aborting.");
        process.exit(1);
    }

    const removed = await Email.deleteMany({ ownerEmail: DEMO_EMAIL });

    const docs = DEMO_EMAILS.map(({ minutesAgo: offset, ...email }) => {
        const timestamp = minutesAgo(offset);
        return {
            ...email,
            ownerEmail: DEMO_EMAIL,
            threadId: email.gmailId,
            date: timestamp,
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    });

    // timestamps:false keeps the staggered createdAt values the inbox renders.
    const inserted = await Email.insertMany(docs, { timestamps: false });

    console.log(`Removed ${removed.deletedCount} existing demo email(s).`);
    console.log(`Seeded ${inserted.length} demo email(s) for ${DEMO_EMAIL}.`);

    await mongoose.connection.close();
};

seed().catch(async (error) => {
    console.error("Demo seed failed:", error.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
});
