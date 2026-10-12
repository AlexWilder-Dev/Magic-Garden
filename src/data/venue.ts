export const VENUE = {
  name: 'The Magic Garden',
  street: '231 Battersea Park Road',
  city: 'London SW11 4LG',
  near: 'by Battersea Park',
  phone: '020 7622 4844',
  phoneHref: 'tel:+442076224844',
  email: {
    info: 'info@magicgardenpub.com',
    bookings: 'bookings@magicgardenpub.com',
    music: 'music@magicgardenpub.com',
    press: 'promotions@magicgardenpub.com',
  },
  social: {
    instagram: 'https://instagram.com/magic_pub',
    x: 'https://twitter.com/magic_pub',
    facebook: 'https://facebook.com/TheMagicGardenBattersea',
  },
  directions:
    'https://www.google.com/maps/search/?api=1&query=The+Magic+Garden+Battersea&query_place_id=ChIJswZMtAcFdkgRD8YIJsrmXqY',
  backline: 'https://www.magicgardenpub.com/wp-content/uploads/2015/12/Backline-Details.pdf',
  rating: 4.2,
  reviewCount: 1646,
} as const;

/** Opening hours, in minutes after midnight. A close past 1440 runs into the next morning. */
export const OPEN_MIN = 10 * 60 + 30;
export const closeMinFor = (dow: number) => (dow === 5 || dow === 6 ? 26 * 60 : 24 * 60);

export const HOURS_ROWS = [
  { days: 'Sunday to Thursday', short: 'Sun – Thu', dows: [0, 1, 2, 3, 4], hours: '10:30am – midnight' },
  { days: 'Friday & Saturday', short: 'Fri – Sat', dows: [5, 6], hours: '10:30am – 2am' },
];

export const REVIEWS = {
  corporate: 'Adam and the team at magic garden were brilliant for our corporate event.',
  festival: 'it felt like you were almost at a festival!',
  design: 'the creativity with the design in the garden was really fun',
};
