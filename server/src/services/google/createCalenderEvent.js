const { google } = require("googleapis");

const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

const stripOrdinal = (value = "") => value.replace(/(\d)(st|nd|rd|th)/gi, "$1");

const parseEmailDateTime = (dateText, timeText) => {
    if (!dateText || !timeText) return null;

    const cleanedDate = stripOrdinal(dateText).trim();
    const dateMatch = cleanedDate.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    const timeMatch = timeText.trim().match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);

    if (!dateMatch || !timeMatch) return null;

    const day = Number(dateMatch[1]);
    const monthName = dateMatch[2].toLowerCase();
    const year = Number(dateMatch[3]);
    const monthIndex = MONTHS[monthName];
    if (monthIndex === undefined) return null;

    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    const meridiem = timeMatch[3].toUpperCase();

    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    const pad = (value) => String(value).padStart(2, "0");
    return `${year}-${pad(monthIndex + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+05:30`;
};

const formatDateTimeWithOffset = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
    ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}:00+05:30`;
};

const extractMeetingSlots = (emailText = "") => {
    const normalized = emailText.replace(/\s+/g, " ");
    const slotRegex =
        /(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}).{0,40}?at\s+(\d{1,2}:\d{2}\s*[AP]M)/gi;

    const slots = [];
    let match;
    while ((match = slotRegex.exec(normalized)) !== null) {
        slots.push({
            date: match[1],
            time: match[2],
        });
    }

    if (slots.length >= 2) {
        return { start: slots[0], end: slots[1] };
    }

    return { start: slots[0] || null, end: null };
};

const createCalendarEvent = async (
    accessToken,
    meetingData = {},
    emailText = ""
) => {

    try {

        const oauth2Client =
            new google.auth.OAuth2();

        oauth2Client.setCredentials({
            access_token: accessToken,
        });

        const calendar =
            google.calendar({
                version: "v3",
                auth: oauth2Client,
            });

        const slotFromText = extractMeetingSlots(emailText);
        const startCandidate =
            meetingData?.start ||
            slotFromText.start ||
            (meetingData?.date && meetingData?.time
                ? { date: meetingData.date, time: meetingData.time }
                : null);
        const endCandidate =
            meetingData?.end || slotFromText.end || null;

        const startDateTime =
            parseEmailDateTime(startCandidate?.date, startCandidate?.time) ||
            null;
        const endDateTime =
            parseEmailDateTime(endCandidate?.date, endCandidate?.time) || null;

        if (!startDateTime) {
            throw new Error(
                "Could not detect a meeting time in the email. Please include a clear date and time."
            );
        }

        const startDate = new Date(startDateTime);
        const fallbackEnd = new Date(startDate.getTime() + 30 * 60 * 1000);
        const event = {
            summary: "Saarthi AI Meeting",

            description: emailText
                ? `Created by Saarthi Mail AI\n\n${emailText}`
                : "Created by Saarthi Mail AI",

            start: {
                dateTime: startDateTime,
                timeZone:
                    "Asia/Kolkata",
            },

            end: {
                dateTime: endDateTime || formatDateTimeWithOffset(fallbackEnd),
                timeZone:
                    "Asia/Kolkata",
            },
        };

        const response =
            await calendar.events.insert({
                calendarId: "primary",

                resource: event,
            });

        return response.data;

    } catch(error) {

        console.log(error);

        throw error;
    }
};

module.exports = createCalendarEvent;
