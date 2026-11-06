// RFC 5545 snapshot: public event fields only, no participant information.
const escapeText = value => String(value).replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const timestamp = value => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError('Invalid calendar date');
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
};
function fold(line) {
  const lines = []; let current = '';
  for (const character of line) {
    if (Buffer.byteLength(current + character, 'utf8') > 75) { lines.push(current); current = ' '; }
    current += character;
  }
  lines.push(current);
  return lines.join('\r\n');
}
export function exportEvent(event, now = new Date()) {
  if (!/^[a-f0-9]{32}$/.test(event.id)) throw new TypeError('Invalid calendar event ID');
  if (Date.parse(event.endsAt) <= Date.parse(event.startsAt)) throw new TypeError('Invalid calendar interval');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MuBanneD//Community Calendar//PT-BR', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${event.id}@mubanned.local`, `DTSTAMP:${timestamp(now)}`,
    `DTSTART:${timestamp(event.startsAt)}`, `DTEND:${timestamp(event.endsAt)}`,
    `SUMMARY:${escapeText(event.title)}`, `DESCRIPTION:${escapeText(event.description)}`,
    `STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT', 'END:VCALENDAR'
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
