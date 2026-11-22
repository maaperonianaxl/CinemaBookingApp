# Movie Masters - Demo Script (about 6 minutes)

## Before you start

- [ ] Phone is charged, internet is on, APK is installed (or Expo Go is running)
- [ ] Create **two accounts** beforehand (for example `demo1@example.com` and `demo2@example.com`, password `password123`)
- [ ] Log out of both so you can show the sign-up and login
- [ ] On a second device (or the emulator) log in as `demo2` to prove data is shared
- [ ] Set the phone to Do Not Disturb

## Feature list (30-second summary to say out loud)

> "Movie Masters is a cinema booking app. Users create an account, browse and search movies,
> read details and trailers, pick their own seats on a seat map, and manage or cancel their tickets.
> Everything is stored in a Supabase cloud database, so bookings and seat availability are shared
> across devices. The app also has a profile photo, account settings and a dark and light theme."

## Walkthrough

| # | Do | Say |
|---|---|---|
| 1 | Open the app. Splash screen appears, then the welcome screen. | "The app shows a splash screen while it restores your saved login." |
| 2 | Tap **Get started > Sign up**. Fill the form, enter OTP `1234`. | "Sign-up validates every field. The OTP step is a demo, then the account is created in Supabase." |
| 3 | You land on **Movies**. Search for "toy", then clear it and tap a genre chip. | "Search and genre filters work on the movie list. Movies are local data files." |
| 4 | Open **Toy Story 5**. Scroll through synopsis and cast. Tap **Watch trailer**. | "This is a dynamic route: `movie/[id]`. Only the id is passed, and the screen looks the movie up." |
| 5 | Back, tap **Book tickets**. Choose a date and **7:30 PM**. | "Dates are generated for the next seven days." |
| 6 | Tap **Choose seats**. Pick 2 seats. Point at the legend and the taken seats. | "This seat map comes from the database. Taken seats are disabled." |
| 7 | Tap **Confirm booking**, then **View tickets**. | "The booking and one ticket per seat are created in one database transaction." |
| 8 | **Second device:** open the same movie, date and time. | "The seats the first user booked are now taken here too. That is the shared backend." |
| 9 | Back on device 1: **Profile > Cancel booking** and confirm. | "Cancelling frees the seats. They become available again for everyone." |
| 10 | Tap the avatar, choose a photo. Go back to **Movies**. | "The profile photo is saved with the account and shows on the home screen." |
| 11 | **Settings:** change the name, then switch to **Light** theme. | "Settings lets users edit their profile, change their password and pick a theme." |
| 12 | Close the app completely and reopen it. | "The login session is saved, so the user goes straight to Movies." |
| 13 | **Profile > Log out.** | "Logging out sends the user back to the welcome screen." |

## Screenshot shot list (take these on the phone)

1. `01-welcome.png` - welcome screen
2. `02-login.png` - login
3. `03-movies.png` - movie list (with the genre chips visible)
4. `04-details.png` - movie details
5. `05-showtimes.png` - date and time selected
6. `06-seats.png` - seat map with a few seats selected and some taken
7. `07-profile.png` - profile with bookings and tickets
8. `08-settings.png` - settings
9. `09-light-theme.png` - movies or profile in the light theme

Save them in `docs/screenshots/`.

## Likely questions and short answers

| Question | Answer |
|---|---|
| How do you prevent two people booking the same seat? | The `tickets` table has a unique constraint on movie, date, time and seat. The booking function runs in one transaction, so one of two simultaneous bookings fails and the app asks the user to pick other seats. |
| Is user data private? | Yes. Row Level Security means each user can only read their own profile, bookings and tickets. |
| Where is the password stored? | In Supabase Auth, hashed. The app never stores passwords. |
| Why is the API key inside the app? | It is a publishable key, designed to be public. Security comes from Row Level Security, not from hiding the key. |
| How does the app remember the login? | Supabase saves the session in AsyncStorage and refreshes it automatically. |
| How does the theme work? | A ThemeContext provides a colour palette. Every screen builds its styles from it, and the choice is saved on the device. |
| What would you improve next? | Real email OTP, payments, push reminders, real showtimes per movie, and Supabase Storage for photos. |