const { startOfWeekInIST } = require("../utils/istDate.js");

const isDemoLoginEnabled = () =>
    process.env.ENABLE_DEMO_LOGIN === "true" && !!process.env.DEMO_USER_EMAIL;

const buildDemoUser = () => ({
    googleId: "demo-user",
    name: "Demo User",
    email: process.env.DEMO_USER_EMAIL,
    picture: null,
    accessToken: null,
    refreshToken: null,
    isDemo: true,
});

/** Monday 00:00 IST of the week containing `date`. */
const weekStart = (date) => startOfWeekInIST(date);

/** `minutesPastHour` above 59 rolls forward, so an end slot is hour + duration. */
const at = (monday, dayOffset, hour, minutesPastHour = 0) => {
    const slot = new Date(monday);
    slot.setDate(slot.getDate() + dayOffset);
    slot.setHours(hour, minutesPastHour, 0, 0);
    return slot.toISOString();
};

/**
 * The demo account has no Google token, so its calendar is generated relative
 * to whichever week is being viewed. This lives on the server, behind the
 * `isDemo` branch in the controller, so a real session can never receive it.
 */
const buildDemoCalendarEvents = (timeMin) => {
    const monday = weekStart(timeMin ? new Date(timeMin) : new Date());

    return [
        { id: "demo-ev-1", title: "Team Standup", day: 0, hour: 9, duration: 30, kind: "primary" },
        { id: "demo-ev-2", title: "Design Sprint", day: 1, hour: 10, duration: 60, kind: "success" },
        { id: "demo-ev-3", title: "Client Review", day: 2, hour: 9, duration: 90, kind: "important" },
        { id: "demo-ev-4", title: "Deadline: API spec", day: 3, hour: 12, duration: 60, kind: "urgent" },
        { id: "demo-ev-5", title: "1:1 with PM", day: 4, hour: 10, duration: 45, kind: "primary" },
    ].map((event) => ({
        id: event.id,
        title: event.title,
        start: at(monday, event.day, event.hour),
        end: at(monday, event.day, event.hour, event.duration),
        allDay: false,
        kind: event.kind,
        location: null,
        htmlLink: null,
    }));
};

module.exports = { buildDemoUser, isDemoLoginEnabled, buildDemoCalendarEvents };
