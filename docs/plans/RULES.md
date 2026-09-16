# 📋 WD-301 Final Project: Requirements & Rules Summary

## 🎯 1. Project Overview & Theme

- **Theme Selection:** 2. Workshops or training sessions

## 🔐 2. Authentication & Security

- **Custom Implementation:**    
  Implement sign-up, login, and logout yourself using cookie sessions. Do not use a third-party authentication provider.

- **Passwords:**    
  Passwords must be securely hashed

- **Role Verification:**    
Every server-side action that changes data must verify the signed-in user and their role

## 👥 3. Features by Role

### Regular User

- Can create an account, log in, and log out
- Can register for events with one click and unregister by clicking the same button again
- Can view their upcoming and past events

### Admin

- Is directed to the admin dashboard after login
- Admins are created by a seed script or directly in Atlas, so no admin-management screens are required (unless implementing the bonus feature)
- Can create, edit, and delete events, including setting each event's maximum number of attendees
- Can view the users registered for an event
- Can view all users by name, along with the total number of users. Never display passwords

## 🎫 4. Events & Registration Rules

- **Public Pages:**    
  - Anyone can browse upcoming events and open an event-detail page 
  - Each event page shows the title, description, date and time, location, how many spots are left, and whether the signed-in user is already registered
- **Capacity Management:** 
  - Each event has its own maximum number of attendees, set by an admin and changeable at any time
- **Frontend Control:** 
  - When an event is full, the register button is disabled and the page says the event is full
- **Server-side Enforcement (Critical):** 
  - The server must enforce the same rules on its own. 
  - It must reject a registration when the event is full and never allow the same user to register twice for the same event
  - Do not rely on the disabled button alone

## 🗄️ 5. Database (MongoDB)

- **Tech Stack:** 
  - Use your hosted MongoDB Atlas database with Mongoose
  - SQL databases are not allowed
- **Data Source:** 
  - Users, events, and registrations all live in MongoDB
- **Relationships:** 
  - Use references and `populate` wherever one record needs data from another, for example listing the users registered for an event

## 📝 6. Contentful CMS

- **Target Content:** 
  - Integrate Contentful for the marketing content that a non-technical sales or content team would update
  - This includes the home-page hero, promotional copy, an FAQ, an About page, or featured-event messaging
- **Role Separation:** 
  - Contentful users are not application admins and never manage events, registrations, or user account
  - MongoDB remains the source of truth for all of those
- **Live Updates:** 
  - A change made in Contentful must appear on the deployed site

## 🚀 7. Deployment & Submission

- **Hosting:** 
  - Deploy one Next.js application per team to Vercel
  - Atlas already hosts the database, so the app must be hosted as well
- **MongoDB Atlas Network Access:** 
  - Vercel has no fixed outbound IP address, so set Atlas Network Access to allow access from anywhere (`0.0.0.0/0`)
- **Database Security:** 
  - You are required to configure a database user with `readWrite` on this project's database only
  - use a long generated password, and set `MONGODB_URI` only in Vercel's environment variables
  - never committed to the repository. Set this in Vercel before the first deployment
- **README.md Requirements:** 
  - At the top of the Next.js app's README.md
    - the live Vercel link
    - the GitHub repository link
    - the team members
    - he chosen theme
    - Athe email and password of one admin account and one regular user account on the deployed app for testing. ( These are test accounts )

## 🌟 8. Bonus Features

- **Admin management:** 
  - An admin screen to create new admin users and manage the admin list, instead of seeding them. 
  - Sign-up must never be able to set a role, and an admin must not be able to remove themselves.
- **Live registrations:** 
  - New registrations appear on the admin dashboard without a page refresh. Polling every few seconds is enough
- **Password-reset email:**
  - A password-reset flow that sends a reset link to a regular user's email address
