
export function getPhilippineDateTime() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

export function timeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s(AM|PM)$/i.exec(time || '');

  if (!match) return null;

  let hour = Number(match[1]) % 12;

  if (match[3].toUpperCase() === 'PM') {
    hour += 12;
  }

  return hour * 60 + Number(match[2]);
}

export function hasShowtimePassed(date, time, current = getPhilippineDateTime()) {
  const showMinutes = timeToMinutes(time);

  if (!date || showMinutes === null) return true;

  if (date < current.date) return true;
  if (date > current.date) return false;

  return showMinutes <= current.minutes;
}
