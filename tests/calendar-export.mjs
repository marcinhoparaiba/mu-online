import test from 'node:test';
import assert from 'node:assert/strict';
import { exportEvent } from '../calendar-export.mjs';
const event = { id: 'a'.repeat(32), title: 'PvP, edição; especial', description: 'Primeira linha\nSegunda \\ linha', startsAt: '2026-11-08T18:00:00-03:00', endsAt: '2026-11-08T19:30:00-03:00', status: 'scheduled', attendees: ['PRIVATE-PARTICIPANT'], by: 'PRIVATE-AUTHOR' };
const unfold = text => text.replace(/\r\n /g, '');
test('calendar exports UTC dates, escaped text and stable event identity without private fields', () => {
  const text = unfold(exportEvent(event, new Date('2026-11-06T12:00:00Z')));
  assert.ok(text.includes('DTSTART:20261108T210000Z\r\n'));
  assert.ok(text.includes('DTEND:20261108T223000Z\r\n'));
  assert.ok(text.includes('SUMMARY:PvP\\, edição\\; especial\r\n'));
  assert.ok(text.includes('DESCRIPTION:Primeira linha\\nSegunda \\\\ linha\r\n'));
  assert.ok(text.includes('STATUS:CONFIRMED\r\n'));
  assert.ok(text.includes(`UID:${event.id}@mubanned.local\r\n`));
  assert.ok(!text.includes('PRIVATE-'));
  const cancelled = unfold(exportEvent({ ...event, status: 'cancelled' }));
  assert.ok(cancelled.includes('STATUS:CANCELLED\r\n'));
  assert.ok(cancelled.includes(`UID:${event.id}@mubanned.local\r\n`));
});
test('calendar folds UTF-8 lines to 75 bytes without splitting code points or injecting properties', () => {
  const title = '🔥 ação '.repeat(40) + '\r\nATTENDEE:intruder';
  const text = exportEvent({ ...event, title });
  for (const line of text.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.ok(!text.includes('\ufffd'));
  assert.ok(!text.includes('\r\nATTENDEE:'));
  assert.ok(unfold(text).includes('\\nATTENDEE:intruder'));
  assert.ok(text.endsWith('END:VCALENDAR\r\n'));
});
test('calendar rejects invalid dates, reversed intervals and identifiers', () => {
  assert.throws(() => exportEvent({ ...event, startsAt: 'invalid' }), /date/);
  assert.throws(() => exportEvent({ ...event, endsAt: event.startsAt }), /interval/);
  assert.throws(() => exportEvent({ ...event, id: 'bad\r\nUID:other' }), /ID/);
});
