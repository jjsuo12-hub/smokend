export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toTimeKey(date: Date) {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatKoreanDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getQuitDay(quitStartDate: string, now = new Date()) {
  const start = startOfLocalDay(new Date(`${quitStartDate}T00:00:00`));
  const current = startOfLocalDay(now);
  const diff = current.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export function getQuitStartDateFromDays(days: number, now = new Date()) {
  return toDateKey(addDays(startOfLocalDay(now), -Math.max(0, days)));
}

export function isAfterReminderTime(date: Date, reminderTime: string) {
  const [hourText, minuteText] = reminderTime.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return date.getHours() > hour || (date.getHours() === hour && date.getMinutes() >= minute);
}
