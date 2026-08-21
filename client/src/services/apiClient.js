const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");

const getJson = async (path, options = {}) => {
  const hasBody = options.body !== undefined;
  const headers = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || payload?.error || "Request failed";
    throw new Error(message);
  }

  return payload;
};

export const api = {
  getGmail: () => getJson("/api/gmail"),
  getGmailMessage: (messageId) => getJson(`/api/gmail/message/${messageId}`),
  getMail: () => getJson("/api/mail"),
  getPriorityMail: () => getJson("/api/mail/priority"),
  getMailById: (id) => getJson(`/api/mail/${id}`),
  generateReply: (emailText, mailId) =>
    getJson("/api/mail/reply", {
      method: "POST",
      body: JSON.stringify({ emailText, mailId }),
    }),
  detectMeeting: (emailText) =>
    getJson("/api/mail/meeting", {
      method: "POST",
      body: JSON.stringify({ emailText }),
    }),
  createCalendarEvent: (emailText) =>
    getJson("/api/mail/calendar/create", {
      method: "POST",
      body: JSON.stringify({ emailText }),
    }),
  listCalendarEvents: (timeMin, timeMax) =>
    getJson(
      `/api/mail/calendar/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
    ),
  checkAuth: () => getJson("/api/auth/status"),
  demoLogin: () => getJson("/api/auth/demo", { method: "POST" }),
  logout: () => getJson("/api/auth/logout", { method: "POST" }),
};

export { API_BASE_URL };
