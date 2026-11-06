export type EventRow = { id: number; name: string; description: string; kind: string; schedule: string; duration_min: number; active?: number };

/**
 * Formatos de agenda:
 *  every:<minutos>:<offset>        ex. every:120:0
 *  daily:HH:MM,HH:MM               ex. daily:13:00,19:00
 *  weekly:<dia 0=dom>:HH:MM        ex. weekly:0:20:00
 */
export function nextOccurrences(schedule: string, from: Date, count = 3): Date[] {
  const out: Date[] = [];
  const [type, ...rest] = schedule.split(":");
  if (type === "every") {
    const every = Number(rest[0]) || 60, offset = Number(rest[1]) || 0;
    const d = new Date(from); d.setHours(0, 0, 0, 0);
    let t = d.getTime() + offset * 60000;
    while (out.length < count) { if (t > from.getTime()) out.push(new Date(t)); t += every * 60000; }
  } else if (type === "daily") {
    const times = rest.join(":").split(",").map((s) => s.split(":").map(Number));
    for (let day = 0; out.length < count && day < 8; day++)
      for (const [h, m] of times) {
        const d = new Date(from); d.setDate(d.getDate() + day); d.setHours(h, m, 0, 0);
        if (d > from && out.length < count) out.push(d);
      }
  } else if (type === "weekly") {
    const dow = Number(rest[0]), h = Number(rest[1]), m = Number(rest[2]);
    for (let w = 0; out.length < count && w < 10; w++) {
      const d = new Date(from); d.setHours(h, m, 0, 0);
      d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7) + w * 7);
      if (d > from) out.push(d);
    }
  }
  return out;
}

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export function describeSchedule(s: string): string {
  const [type, ...rest] = s.split(":");
  if (type === "every") return `A cada ${Number(rest[0]) / 60}h`;
  if (type === "daily") return `Diário às ${rest.join(":").split(",").join(", ")}`;
  if (type === "weekly") return `Todo ${DIAS[Number(rest[0])]} às ${rest[1]}:${rest[2]}`;
  return s;
}

export const brl = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
