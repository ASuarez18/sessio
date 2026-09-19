# WD-301 Final Project: Event Registration App

Build a Next.js event-registration app for a fictional organization. The organization currently tracks its events and sign-ups through spreadsheets, email, and phone calls, and needs one place to manage them.

UI wireframe suggestions are in the `docs` folder. Treat them as a starting point, not a requirement.

## Choose one event theme

Choose one of the following themes:

1. Campus club events
2. Workshops or training sessions
3. Sports tournaments or recreational activities
4. Community volunteer events
5. Concerts, performances, or art events

Make the branding, wording, sample events, and design fit your chosen theme.

## Public pages

Anyone can browse upcoming events and open an event-detail page. Each event page shows the title, description, date and time, location, how many spots are left, and whether the signed-in user is already registered.

## Authentication and roles

Implement sign-up, login, and logout yourself using cookie sessions. Do not use a third-party authentication provider.

Passwords must be securely hashed. Every server-side action that changes data must verify the signed-in user and their role.

- **Regular user:** can create an account, log in, register for events with one click, unregister by clicking the same button again, view their upcoming and past events, and log out.
- **Admin:** is directed to the admin dashboard after login. Admins are created by a seed script or directly in Atlas, so no admin-management screens are required.

## Admin dashboard

Admins must be able to:

- Create, edit, and delete events, including each event's maximum number of attendees
- View the users registered for an event
- View all users by name, along with the total number of users. Never display passwords.

## Registration rules

- Each event has its own maximum number of attendees, set by an admin and changeable at any time.
- When an event is full, the register button is disabled and the page says the event is full.
- The server must enforce the same rules on its own: reject a registration when the event is full, and never allow the same user to register twice for the same event. Do not rely on the disabled button alone.

## MongoDB

Use your hosted MongoDB Atlas database with Mongoose. SQL databases are not allowed.

Users, events, and registrations all live in MongoDB. Use references and `populate` wherever one record needs data from another, for example listing the users registered for an event.

## Contentful CMS

Integrate Contentful for the marketing content that a non-technical sales or content team would update: the home-page hero, promotional copy, an FAQ, an About page, or featured-event messaging. Contentful users are not application admins and never manage events, registrations, or user accounts. MongoDB remains the source of truth for all of those.

A change made in Contentful must appear on the deployed site.

## Bonus features

### Admin management

An admin screen to create new admin users and manage the admin list, instead of seeding them. Sign-up must never be able to set a role, and an admin must not be able to remove themselves.

### Live registrations

New registrations appear on the admin dashboard without a page refresh. Polling every few seconds is enough.

### Password-reset email

A password-reset flow that sends a reset link to a regular user's email address.

## Deployment and submission

- Deploy one Next.js application per team to Vercel. Atlas already hosts the database, so the app must be hosted as well.
- Vercel has no fixed outbound IP address, so set Atlas **Network Access** to allow access from anywhere (`0.0.0.0/0`). In return, the other layers are required: a database user with `readWrite` on this project's database only, a long generated password, and `MONGODB_URI` set only in Vercel's environment variables, never committed to the repository.
- Set `MONGODB_URI` in Vercel before the first deployment. The build fails without it.
- Demo the deployed app, not localhost.
- Submit one repository per team. At the top of the Next.js app's `README.md`, list the live Vercel link, the GitHub repository link, the team members, and the chosen theme.
- Also include in the `README.md` the email and password of one admin account and one regular user account on the deployed app, so your instructor can test both roles. These are test accounts, not real credentials.

Build it like the organization is paying your team to solve its problem.
