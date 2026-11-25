
const BASE = 'https://api.themoviedb.org/3';
const IMAGE = 'https://image.tmdb.org/t/p/w500';
const TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

const REGION = 'PH';
const PAGES = [1, 2];
const CACHE_TIME = 5 * 60 * 1000;

const releaseCache = new Map();
const detailsCache = new Map();
let categoryCache = null;
let cacheTime = 0;
let pendingRequest = null;

async function request(endpoint) {
  if (!TOKEN) throw new Error('TMDB access token is missing.');

  const response = await fetch(`${BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) throw new Error(`TMDB Error: ${response.status}`);

  return response.json();
}

async function fetchMovies(endpoint, page) {
  const params = new URLSearchParams({
    language: 'en-US',
    region: REGION,
    page: String(page),
  });

  const data = await request(`${endpoint}?${params}`);
  return data.results || [];
}

export async function fetchMovieDetails(id) {
  if (detailsCache.has(id)) return detailsCache.get(id);

  const promise = request(
    `/movie/${id}?language=en-US&append_to_response=credits,videos`
  );

  detailsCache.set(id, promise);

  try {
    return await promise;
  } catch (error) {
    detailsCache.delete(id);
    throw error;
  }
}

async function getReleaseDate(id) {
  if (releaseCache.has(id)) return releaseCache.get(id);

  const promise = (async () => {
    const data = await request(`/movie/${id}/release_dates`);
    const country = data.results?.find((item) => item.iso_3166_1 === REGION);

    return (country?.release_dates || [])
      .filter((item) => [2, 3].includes(item.type))
      .map((item) => item.release_date?.slice(0, 10))
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
      .sort()[0] || null;
  })();

  releaseCache.set(id, promise);

  try {
    return await promise;
  } catch (error) {
    releaseCache.delete(id);
    console.warn(`Release date error (${id}):`, error.message);
    return null;
  }
}

async function fetchCategory(endpoint) {
  const pages = await Promise.all(
    PAGES.map((page) => fetchMovies(endpoint, page))
  );

  return [...new Map(
    pages.flat().filter((movie) => movie.id).map((movie) => [movie.id, movie])
  ).values()];
}

async function addReleaseDates(categories) {
  const allMovies = [
    ...new Map(
      Object.values(categories).flat()
        .filter((movie) => movie.id)
        .map((movie) => [movie.id, movie])
    ).values(),
  ];

  const dates = new Map();
  let index = 0;

  const worker = async () => {
    while (index < allMovies.length) {
      const movie = allMovies[index++];
      dates.set(movie.id, await getReleaseDate(movie.id));
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(5, allMovies.length) }, worker)
  );

  return Object.fromEntries(
    Object.entries(categories).map(([name, list]) => [
      name,
      list.map((movie) => ({
        ...movie,
        ph_release_date: dates.get(movie.id) || null,
      })),
    ])
  );
}

async function loadCategories() {
  const endpoints = {
    popular: '/movie/popular',
    nowPlaying: '/movie/now_playing',
    upcoming: '/movie/upcoming',
    topRated: '/movie/top_rated',
  };

  const categories = Object.fromEntries(
    await Promise.all(
      Object.entries(endpoints).map(async ([name, endpoint]) => [
        name,
        await fetchCategory(endpoint),
      ])
    )
  );

  return addReleaseDates(categories);
}

export async function fetchMovieCategories() {
  if (categoryCache && Date.now() - cacheTime < CACHE_TIME) {
    return categoryCache;
  }

  if (pendingRequest) return pendingRequest;

  pendingRequest = loadCategories();

  try {
    categoryCache = await pendingRequest;
    cacheTime = Date.now();
    return categoryCache;
  } finally {
    pendingRequest = null;
  }
}

export function getMoviePoster(path) {
  return path ? `${IMAGE}${path}` : null;
}
