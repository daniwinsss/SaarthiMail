import { normalizePriority } from './priority';

export const initialsFrom = (name) =>
  String(name || '')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const relativeFrom = (date) => {
  if (!date) return 'Today';
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

/**
 * Normalizes an Email document from /api/mail into the shape the screens render.
 * Shared by Inbox, Priority and MailDetail so the derived fields (id, initials,
 * timestamp, priority) can never drift between them.
 */
export const mapEmail = (email = {}, index = 0) => {
  const sender = email.sender || 'Unknown Sender';
  const createdAt = email.createdAt || email.date ? new Date(email.createdAt || email.date) : null;
  const valid = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : null;

  return {
    id: email._id || email.gmailId || String(index),
    gmailId: email.gmailId || '',
    sender,
    senderEmail: email.senderEmail || 'unknown@email.com',
    subject: email.subject || email.snippet || 'No subject',
    snippet: email.snippet || 'No preview available',
    content: email.body || email.content || email.snippet || '',
    priority: normalizePriority(email.priority),
    initials: initialsFrom(sender) || 'NA',
    timestamp: valid
      ? valid.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Today',
    relative: relativeFrom(valid),
    aiSummary: email.summary || email.ai?.summary || '',
    action: email.action || email.ai?.action || '',
    reply: email.reply || email.ai?.reply || '',
    isUnread: Boolean(email.isUnread ?? normalizePriority(email.priority) !== 'later'),
    rawDate: valid?.getTime() || 0,
  };
};

export const mapEmails = (list) => (Array.isArray(list) ? list.map(mapEmail) : []);

/** Case-insensitive match across the fields the Topbar search box should reach. */
export const matchesQuery = (email, query) => {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  return [email.sender, email.senderEmail, email.subject, email.snippet]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(q));
};
