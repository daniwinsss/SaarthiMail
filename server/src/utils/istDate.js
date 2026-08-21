const IST_OFFSET_MINUTES = 330;
const IST_OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000;

const toISTParts = (date) => {
    const shifted = new Date(date.getTime() + IST_OFFSET_MS);
    return {
        year: shifted.getUTCFullYear(),
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        dayOfWeek: shifted.getUTCDay(),
        hours: shifted.getUTCHours(),
        minutes: shifted.getUTCMinutes(),
        seconds: shifted.getUTCSeconds(),
    };
};

const fromISTParts = ({
    year,
    month,
    day,
    hours = 0,
    minutes = 0,
    seconds = 0,
}) =>
    new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds) - IST_OFFSET_MS);

const startOfWeekInIST = (date) => {
    const parts = toISTParts(date);
    const mondayOffset = (parts.dayOfWeek + 6) % 7;

    return fromISTParts({
        year: parts.year,
        month: parts.month,
        day: parts.day - mondayOffset,
    });
};

const addDaysInIST = (date, days) => {
    const parts = toISTParts(date);
    return fromISTParts({
        year: parts.year,
        month: parts.month,
        day: parts.day + days,
        hours: parts.hours,
        minutes: parts.minutes,
        seconds: parts.seconds,
    });
};

module.exports = {
    IST_OFFSET_MS,
    addDaysInIST,
    fromISTParts,
    startOfWeekInIST,
    toISTParts,
};
