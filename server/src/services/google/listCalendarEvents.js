const { google } = require("googleapis");

/**
 * Google returns all-day events as `start.date` (YYYY-MM-DD) and timed events
 * as `start.dateTime` (RFC3339). The client only ever needs an ISO instant plus
 * a flag, so collapse both shapes here.
 */
const readSlot = (slot = {}) => {
    if (slot.dateTime) return { value: slot.dateTime, allDay: false };
    if (slot.date) return { value: slot.date, allDay: true };
    return { value: null, allDay: false };
};

/** Colour bucket for the grid. Cancelled/tentative reads as muted, accepted as primary. */
const kindFor = (event) => {
    const self = (event.attendees || []).find((attendee) => attendee.self);
    if (self?.responseStatus === "declined") return "urgent";
    if (self?.responseStatus === "tentative") return "important";
    if (event.eventType === "outOfOffice" || event.transparency === "transparent") {
        return "success";
    }
    return "primary";
};

const mapEvent = (event) => {
    const start = readSlot(event.start);
    const end = readSlot(event.end);

    return {
        id: event.id,
        title: event.summary || "(no title)",
        start: start.value,
        end: end.value,
        allDay: start.allDay,
        kind: kindFor(event),
        location: event.location || null,
        htmlLink: event.htmlLink || null,
    };
};

/**
 * Reads the signed-in user's primary calendar between two ISO instants.
 * `singleEvents` expands recurring series so the grid gets one entry per
 * occurrence rather than a single master event.
 */
const listCalendarEvents = async (accessToken, timeMin, timeMax) => {
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
        access_token: accessToken,
    });

    const calendar = google.calendar({
        version: "v3",
        auth: oauth2Client,
    });

    const response = await calendar.events.list({
        calendarId: "primary",
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
    });

    return (response.data.items || [])
        .filter((event) => event.status !== "cancelled")
        .map(mapEvent)
        .filter((event) => event.start);
};

module.exports = listCalendarEvents;
