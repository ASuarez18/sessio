# 🎟️ Sessio - Event Management & Workshop Platform

> A full-stack, responsive event discovery and administration platform built with Next.js App Router, MongoDB, and Contentful CMS for organizing, discovering, and managing hands-on technical workshops.

---

## 📌 Submission & Deployment Details

* **Live Application:** [https://sessio-two-khaki.vercel.app/](https://sessio-two-khaki.vercel.app/)
* **Event Theme:** Technical Workshops & Training Sessions

---

## 🧪 Test Accounts (For Instructor Evaluation)

*Use these credentials to test role-specific access and permissions during grading.*

| Role | User | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | admin | `admin@eventhub.dev` | `Admin123!` | Full access to `/admin` dashboard, event CRUD, user management, and stats. |
| **Regular User** | taylork | `taylor.kim@example.com` | `Password123!` | Public site browsing, event registration/unregistration, and personal profile. |

> **Note:** These are non-sensitive test credentials created exclusively for platform evaluation.

---

## 📖 Overview & Key Features

Sessio centralizes workshop organization, attendee tracking, and event discovery into a unified, secure web application.

### 👥 Role-Based Capabilities

#### 🌐 Public / Non-Authenticated Users
* **Dynamic Landing & Marketing Pages:** Home, About, and FAQ sections powered by **Contentful CMS** utilizing native Rich Text rendering.
* **Live Category Highlights:** Dynamic computation of active event counts grouped by fixed category enums (`Web Dev`, `Software Engineering`, `AI & ML`, `UI design`, etc.) pulled directly from MongoDB.
* **Workshop Discovery:** Browse upcoming/ongoing events with real-time detail views.

#### 👤 Regular Users
* **Custom Session Auth:** Secure cookie-based sign-up, login, and logout.
* **1-Click Workshop Registration:** Register or unregister instantly for available workshops with dynamic capacity tracking.
* **Personal Dashboard:** View registered sessions and past attendance history.

#### 🛡️ Administrator Panel (`/admin`)
* **Dedicated Layout & Navigation:** Modular, sticky `Sidebar` layout with independent content scrolling for smooth navigation.
* **Platform Analytics:** Real-time metrics overview (Total Users, Total Events, Upcoming Workshops, Total Registrations).
* **Event Management (CRUD):** Create, update, preview (live image preview), and delete event listings.
* **User & Admin Management:** Segregated user tables with real-time client-side search/filtering.
* **Self-Deletion Guard:** Critical safety control that disables self-deletion for the currently logged-in administrator (`currentUserId !== user._id`).

---

## 🛠️ Tech Stack & System Architecture

* **Framework:** Next.js (App Router, TypeScript)
* **Styling & UI:** Tailwind CSS (Custom Theme & CSS Variables)
* **Database & ODM:** MongoDB Atlas + Mongoose
* **CMS (Marketing Copy):** Contentful (SDK & `@contentful/rich-text-react-renderer`)
* **Security & Auth:** Custom Cookie Sessions, Password Hashing via `bcryptjs`
* **Deployment:** Vercel

---

### 🏗️ 3-Layer Architecture Pattern

The backend services strictly adhere to a decoupled, 3-tier architecture for clean separation of concerns:

```text
Database Layer (lib/mongodb.ts & models/*.ts)
       │
       ▼
Business Logic Layer (services/*.service.ts)
       │
       ▼
HTTP Layer / Controller (app/api/* & App Router Server Components)