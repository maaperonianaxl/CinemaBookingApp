
export const showtimes = [
  '10:00 AM',
  '1:30 PM',
  '4:00 PM',
  '7:30 PM',
  '9:45 PM',
];

// Cinema hall seating configuration
export const seatRows = 'ABCDEFGHIJ'.split('');

export const seatsPerRow = 15;

// Three separate seating sections with two aisles
export const seatSections = [
  {
    name: 'LEFT',
    start: 1,
    count: 3,
  },
  {
    name: 'CENTER',
    start: 4,
    count: 9,
  },
  {
    name: 'RIGHT',
    start: 13,
    count: 3,
  },
];
