# Movie Masters

A cinema booking mobile app built with **Expo (React Native)**, **Expo Router** and **Supabase**.
Browse movies, read details, pick your own seats and manage your tickets. Accounts, bookings and seat
availability live in a cloud database, so they are shared across devices.

## Features

- **Accounts:** sign up (with a demo OTP step), log in, log out, saved login session
- **Movies:** now showing / upcoming lists, search, genre filters
- **Movie details:** poster, synopsis, director, cast, release date, trailer link
- **Showtimes:** choose a real date (next 7 days) and a showtime
- **Seat picker:** an 8 x 8 seat grid, taken seats are disabled, up to 6 seats per booking
- **No double booking:** the database refuses a seat that is already sold
- **My bookings and tickets:** every booking has one ticket per seat with a ticket code
- **Cancel booking:** cancel an upcoming booking and free its seats
- **Profile:** profile photo (stored with the account), pull to refresh
- **Settings:** edit name, change password (verifies the current one), Dark / Light / System theme
- **Polish:** splash screen, loading spinners on every network action, friendly error messages

## Tech stack

| Area | Tool |
|---|---|
| App | Expo SDK 54, React Native, Expo Router (file-based routing) |
| Backend | Supabase (Auth + Postgres + Row Level Security + SQL functions) |
| Icons | lucide-react-native |
| Local storage | AsyncStorage (login session, theme) |
| Builds | EAS Build (Android APK) |

## Screens and navigation

```
Welcome -> Login <-> Sign up -> OTP -> Movies
Movies -> Movie details -> Showtimes -> Seat picker -> Profile
Movies -> Profile -> Settings
```

Signed-out screens (`index`, `login`, `signup`, `otp`) and signed-in screens are separated with
Expo Router **protected routes** (`Stack.Protected`), so the app moves automatically after login or logout.

Dynamic routes (`[id]`): `movie/[id]`, `showtimes/[id]`, `seats/[id]`.

## Getting started

### 1. Create the Supabase project

1. Create a free project at https://supabase.com
2. Open **SQL Editor > New query**, paste the whole file `supabase/schema.sql` and click **Run**
3. Open **Authentication > Sign In / Providers > Email** and turn **OFF** "Confirm email"
   (the app has its own demo OTP step, so email confirmation is not needed)
4. Open **Project Settings > API Keys** and copy:
   - the **Project URL**
   - the **Publishable key** (starts with `sb_publishable_`)

### 2. Configure the app

Copy `.env.example` to `.env` and paste your two values:

```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

The publishable key is designed to be public. Never put a **secret** key in the app.

### 3. Install and run

```
npm install
npx expo install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage expo-image-picker expo-splash-screen expo-status-bar react-native-svg react-native-safe-area-context
npm install lucide-react-native
npx expo start -c
```

Create your own account with **Sign up** (demo OTP code: `1234`).

## Build the Android APK

Add the Supabase values to the `preview` profile in `eas.json` (EAS does not read your local `.env`):

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://YOUR-PROJECT-REF.supabase.co",
        "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_xxxxxxxx"
      }
    }
  }
}
```

Then run:

```
npx expo-doctor
eas build -p android --profile preview
```

## Project structure

```
assets/images/            posters and app icons
supabase/schema.sql       database tables, security rules and functions
src/
  app/                    screens (Expo Router)
    _layout.jsx           providers, splash screen, protected routes
    index.jsx             welcome
    login.jsx  signup.jsx  otp.jsx
    movies.jsx            movie list, search, genre filter
    movie/[id].jsx        movie details
    showtimes/[id].jsx    date and time
    seats/[id].jsx        seat picker
    profile.jsx           profile, bookings, tickets, cancel
    settings.jsx          edit profile, password, theme
  components/             reusable UI (buttons, inputs, cards)
  context/                AuthContext (Supabase), ThemeContext (dark/light)
  data/                   movies, upcoming movies, showtimes and seat layout
  lib/supabase.js         Supabase client
  utils/dates.js          date helpers
```

## Database design

| Table | Purpose |
|---|---|
| `profiles` | one row per user: name, email, avatar, member since (created by a trigger on sign up) |
| `bookings` | one row per booking: user, movie, date, time, seats, status (`ACTIVE` / `CANCELLED`) |
| `tickets` | one row per seat. `UNIQUE (movie_id, show_date, show_time, seat)` prevents double booking |

- **Row Level Security:** a user can only read their own profile, bookings and tickets.
- **`book_seats()`** creates the booking and all its tickets in one transaction (all or nothing).
- **`cancel_booking()`** deletes the booking's tickets (freeing the seats) and marks it `CANCELLED`.
- **`taken_seats()`** returns the taken seats of a showtime so every user sees the same seat map.

The movie catalogue (`src/data/`) is kept as local dummy data with the poster images bundled in the app.

## Requirements checklist

| Requirement | Where |
|---|---|
| Expo Router setup | `src/app/_layout.jsx`, file-based routes, protected routes |
| Dummy data folder and files | `src/data/movies.js`, `upcomingMovies.js`, `showtimes.js` |
| Dynamic route `[id]` | `movie/[id]`, `showtimes/[id]`, `seats/[id]` |
| Navigation between screens | `router.push`, `replace`, `back`, `dismissAll` |
| Display of dynamic data | movie details, seat map, bookings and tickets from Supabase |

## Screenshots

Add your screenshots to `docs/screenshots/` using these names (see `docs/DEMO_SCRIPT.md` for the shot list):

| File | Screen |
|---|---|
| `01-welcome.png` | Welcome |
| `02-login.png` | Login |
| `03-movies.png` | Movie list |
| `04-details.png` | Movie details |
| `05-showtimes.png` | Showtimes |
| `06-seats.png` | Seat picker |
| `07-profile.png` | Profile with bookings and tickets |
| `08-settings.png` | Settings |
| `09-light-theme.png` | Light theme |

## Notes and limitations

- The OTP step is a demo (`1234`), no real message is sent.
- Profile photos are stored as small compressed images inside the `profiles` table. A larger app would use Supabase Storage.
- Showtimes are the same for every movie and every day (dummy data). The seat map is per movie, date and time.
- No payment step.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Missing Supabase settings" | Create `.env` (see `.env.example`) and restart with `npx expo start -c` |
| "Email confirmation is still ON" | Turn off **Confirm email** in Supabase Authentication settings |
| Works in Expo but not in the APK | Add the two `env` values to the `preview` profile in `eas.json` |
| Login works but no data loads | Run `supabase/schema.sql` again and check for SQL errors |
| "Unable to resolve ..." in the cloud build | File names are case-sensitive on the build server. Match the letter case exactly |