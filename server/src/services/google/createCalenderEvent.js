const { google } = require("googleapis");
const { addDaysInIST, fromISTParts, toISTParts } = require("../../utils/istDate.js");

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

const WEEKDAYS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

const stripOrdinal = (value = "") => value.replace(/(\d)(st|nd|rd|th)/gi, "$1");

const startOfTodayInIST = (baseDate = new Date()) => {
    const parts = toISTParts(baseDate);
    return fromISTParts({
        year: parts.year,
        month: parts.month,
        day: parts.day,
    });
};

const formatDateTimeWithOffset = (date) => {
    return date.toISOString();
};

const parseExplicitDate = (dateText, baseDate = new Date()) => {
    if (!dateText) return null;

    const cleanedDate = stripOrdinal(String(dateText)).trim();
    const today = startOfTodayInIST(baseDate);
    const lower = cleanedDate.toLowerCase();

    if (lower.includes("day after tomorrow")) {
        return addDaysInIST(today, 2);
    }

    if (/\btomorrow\b/.test(lower)) {
        return addDaysInIST(today, 1);
    }

    if (/\btoday\b/.test(lower)) {
        return today;
    }

    let match = cleanedDate.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (match) {
        const day = Number(match[1]);
        const monthIndex = MONTHS[match[2].toLowerCase()];
        const year = Number(match[3]);
        if (monthIndex !== undefined) {
            return fromISTParts({
                year,
                month: monthIndex + 1,
                day,
            });
        }
    }

    match = cleanedDate.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    if (match) {
        const monthIndex = MONTHS[match[1].toLowerCase()];
        const day = Number(match[2]);
        const year = Number(match[3]);
        if (monthIndex !== undefined) {
            return fromISTParts({
                year,
                month: monthIndex + 1,
                day,
            });
        }
    }

    match = lower.match(/\b(?:next|this|coming)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
    if (match) {
        const targetDay = WEEKDAYS[match[1]];
        const currentDay = toISTParts(today).dayOfWeek;
        let delta = (targetDay - currentDay + 7) % 7;

        if (delta === 0) {
            delta = 7;
        }

        return addDaysInIST(today, delta);
    }

    return null;
};

const parseExplicitTime = (timeText, emailText = "") => {
    const combined = `${timeText || ""} ${emailText}`.replace(/\s+/g, " ").trim().toLowerCase();
    const explicitMatch =
        combined.match(/\b(\d{1,2}):(\d{2})\s*([ap]m)\b/i) ||
        combined.match(/\b(\d{1,2})\s*([ap]m)\b/i);

    if (explicitMatch) {
        const hour = Number(explicitMatch[1]);
        const minute = explicitMatch[2] && explicitMatch[3] ? Number(explicitMatch[2]) : 0;
        const meridiem = (explicitMatch[3] || explicitMatch[2] || "").toUpperCase();
        let normalizedHour = hour;

        if (meridiem === "PM" && normalizedHour !== 12) normalizedHour += 12;
        if (meridiem === "AM" && normalizedHour === 12) normalizedHour = 0;

        return { hour: normalizedHour, minute };
    }

    if (combined.includes("noon")) {
        return { hour: 12, minute: 0 };
    }
    if (combined.includes("morning")) {
        return { hour: 9, minute: 0 };
    }
    if (combined.includes("afternoon")) {
        return { hour: 15, minute: 0 };
    }
    if (combined.includes("evening")) {
        return { hour: 18, minute: 0 };
    }
    if (combined.includes("night")) {
        return { hour: 19, minute: 0 };
    }

    return { hour: 9, minute: 0 };
};

const resolveMeetingMoment = (dateText, timeText, emailText = "") => {
    const date = parseExplicitDate(dateText || emailText);
    if (!date) return null;

    const time = parseExplicitTime(timeText, emailText);
    const parts = toISTParts(date);

    return fromISTParts({
        year: parts.year,
        month: parts.month,
        day: parts.day,
        hours: time.hour,
        minutes: time.minute,
    }).toISOString();
};

const extractMeetingSlots = (emailText = "") => {
    const normalized = emailText.replace(/\s+/g, " ");
    const slotRegex =
        /(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}).{0,40}?at\s+(\d{1,2}:\d{2}\s*[AP]M|\d{1,2}\s*[AP]M)/gi;

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

    const dateHints = [
        "day after tomorrow",
        "tomorrow",
        "today",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const detectedDate = dateHints.find((hint) => normalized.toLowerCase().includes(hint));
    const detectedTime = normalized.match(/\b(\d{1,2}:\d{2}\s*[AP]M|\d{1,2}\s*[AP]M|morning|afternoon|evening|noon|night)\b/i);

    if (detectedDate || detectedTime) {
        return {
            start: {
                date: detectedDate || null,
                time: detectedTime ? detectedTime[1] : null,
            },
            end: null,
        };
    }

    return { start: null, end: null };
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
            resolveMeetingMoment(startCandidate?.date, startCandidate?.time, emailText) ||
            null;
        const endDateTime =
            resolveMeetingMoment(endCandidate?.date, endCandidate?.time, emailText) || null;

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
