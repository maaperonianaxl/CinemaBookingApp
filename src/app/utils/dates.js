const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n) => String(n).padStart(2, '0');
const toValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayValue = () => toValue(new Date());

// '2026-11-22' -> 'Sun, Nov 22'
export function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${DAYS[date.getDay()]}, ${MONTHS[month - 1]} ${day}`;
}

// The next 7 days, as { value: '2026-11-22', label: 'Today' }
export function getShowDates(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const value = toValue(date);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(value);
    return { value, label };
  });
}

// Display status of a booking
export function getStatus(booking) {
  if (booking.status === 'CANCELLED') return 'CANCELLED';
  return booking.date < todayValue() ? 'WATCHED' : 'UPCOMING';
}