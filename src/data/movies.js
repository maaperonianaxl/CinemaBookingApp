// Opens a YouTube search for the official trailer (always a valid link)
const trailer = (title) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} official trailer`)}`;

export const movies = [
  {
    id: '1',
    title: 'Spider-Man: Brand New Day',
    genre: 'Action / Adventure / Sci-Fi',
    duration: '2h 28m',
    releaseDate: 'Jul 31, 2026',
    director: 'Destin Daniel Cretton',
    synopsis:
      'Years after the world forgot his identity, Peter Parker patrols New York alone as a full-time Spider-Man. As the strain builds, something inside him starts to change, and a dangerous new enemy comes into view.',
    cast: ['Tom Holland', 'Zendaya', 'Sadie Sink', 'Jacob Batalon', 'Jon Bernthal', 'Mark Ruffalo', 'Tramell Tillman'],
    image: require('../../assets/images/spider-man.jpg'),
    trailerUrl: trailer('Spider-Man: Brand New Day'),
  },
  {
    id: '2',
    title: 'Resident Evil',
    genre: 'Action / Horror / Sci-Fi',
    duration: '2h 56m',
    releaseDate: 'Sep 18, 2026',
    director: 'Zach Cregger',
    synopsis:
      'An original story that unfolds alongside the events of Resident Evil 2. Bryan is on his way to deliver medical supplies when he runs into horrifying creatures, and the night turns into a fight to survive.',
    cast: ['Austin Abrams', 'Zach Cherry', 'Kali Reis', 'Paul Walter Hauser', 'Johnno Wilson'],
    image: require('../../assets/images/resident-evil.jpg'),
    trailerUrl: trailer('Resident Evil 2026'),
  },
  {
    id: '3',
    title: 'Toy Story 5',
    genre: 'Animation / Comedy / Family / Adventure',
    duration: '1h 40m',
    releaseDate: 'Jun 19, 2026',
    director: 'Andrew Stanton',
    synopsis:
      'Bonnie gets a frog-shaped smart tablet called Lilypad, and Woody, Buzz and Jessie suddenly find themselves competing with technology for her attention. The toys must work out what Lilypad really wants and how to keep playtime alive.',
    cast: ['Tom Hanks', 'Tim Allen', 'Joan Cusack', 'Greta Lee', 'Tony Hale', "Conan O'Brien"],
    image: require('../../assets/images/toy-story-5.jpg'),
    trailerUrl: trailer('Toy Story 5'),
  },
  {
    id: '4',
    title: 'The End of Oak Street',
    genre: 'Mystery / Sci-Fi / Thriller',
    duration: '1h 39m',
    releaseDate: 'Aug 14, 2026',
    director: 'David Robert Mitchell',
    synopsis:
      "A mysterious cosmic event pulls the Platt family's suburban street out of the everyday world and drops it somewhere unknown and dangerous. To survive their strange new surroundings, the family has to stick together.",
    cast: ['Anne Hathaway', 'Ewan McGregor', 'Maisy Stella', 'Christian Convery', 'Jordan Alexa Davis', 'P.J. Byrne'],
    image: require('../../assets/images/the-end-of-oak-street.jpg'),
    trailerUrl: trailer('The End of Oak Street'),
  },
  {
    id: '5',
    title: 'Forgotten Island',
    genre: 'Animation / Adventure / Family / Fantasy / Comedy',
    duration: '1h 38m',
    releaseDate: 'Sep 25, 2026',
    director: 'Joel Crawford & Januel Mercado',
    synopsis:
      'Lifelong best friends Jo and Raissa stumble onto a portal that sends them to Nakali, a magical island inspired by Filipino mythology and full of fantastical creatures. Together they must face the island and find a way home.',
    cast: ['H.E.R.', 'Liza Soberano', 'Dave Franco', 'Jenny Slate', 'Manny Jacinto', 'Dolly De Leon', 'Lea Salonga'],
    image: require('../../assets/images/forgotten-island.jpg'),
    trailerUrl: trailer('Forgotten Island'),
  },
  {
    id: '6',
    title: 'Backrooms',
    genre: 'Mystery / Sci-Fi / Thriller',
    duration: '1h 50m',
    releaseDate: 'May 29, 2026',
    director: 'Kane Parsons',
    synopsis:
      'A strange doorway opens in the basement of a furniture showroom. Store owner Clark insists he has found a place that should not exist, while his psychologist, Dr. Mary Kline, tries to understand what he has seen.',
    cast: ['Chiwetel Ejiofor', 'Renate Reinsve', 'Mark Duplass', 'Finn Bennett', 'Lukita Maxwell', 'Avan Jogia'],
    image: require('../../assets/images/backrooms.jpg'),
    trailerUrl: trailer('Backrooms'),
  },
];