// Return today's date as YYYY-MM-DD in local time
export function localISODate(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// "Sun", "Mon", "Tue", ...
export function weekdayShort(dateStr, locale = 'en-US') {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, { weekday: 'short' });
}
