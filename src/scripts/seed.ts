import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../lib/mongodb";
import User, { IUser } from "../models/User";
import Event, { IEvent } from "../models/Event";

// --- helpers ---------------------------------------------------------------

/** A date shifted from now by a number of days. */
const daysFromNow = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

/** A copy of `date` shifted by a number of hours (used for event end times). */
const plusHours = (date: Date, hours: number): Date => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

// --- seed data (typed, no `any`) -------------------------------------------

type SeedUser = Pick<IUser, "name" | "email" | "username" | "role"> & {
  password: string;
};

type SeedEvent = Pick<
  IEvent,
  | "title"
  | "description"
  | "startAt"
  | "endAt"
  | "location"
  | "maxAttendees"
  | "status"
  | "imageUrl"
>;

const SEED_USERS: SeedUser[] = [
  {
    name: "Admin User",
    email: "admin@eventhub.dev",
    username: "admin",
    role: "admin",
    password: "Admin123!",
  },
  {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    username: "alexchen",
    role: "user",
    password: "Password123!",
  },
  {
    name: "Taylor Kim",
    email: "taylor.kim@example.com",
    username: "taylork",
    role: "user",
    password: "Password123!",
  },
  {
    name: "Jordan Patel",
    email: "jordan.patel@example.com",
    username: "jordanp",
    role: "user",
    password: "Password123!",
  },
  {
    name: "Casey Nguyen",
    email: "casey.nguyen@example.com",
    username: "caseyn",
    role: "user",
    password: "Password123!",
  },
  {
    name: "Riley Carter",
    email: "riley.carter@example.com",
    username: "rileyc",
    role: "user",
    password: "Password123!",
  },
];

const SEED_EVENTS: SeedEvent[] = [
  {
    title: "Community Tech Workshop",
    description:
      "A hands-on workshop to learn practical tech skills, share ideas, and connect with other community members. All skill levels are welcome!",
    startAt: daysFromNow(7),
    endAt: plusHours(daysFromNow(7), 2),
    location: "Riverside Community Center, Riverton, CA",
    maxAttendees: 50,
    status: "upcoming",
    imageUrl: "https://picsum.photos/seed/workshop/800/450",
  },
  {
    title: "Summer Music Festival",
    description:
      "A full day of live music across three stages featuring local and touring artists.",
    startAt: daysFromNow(21),
    endAt: plusHours(daysFromNow(21), 8),
    location: "Riverside Park, Austin, TX",
    maxAttendees: 200,
    status: "upcoming",
    imageUrl: "https://picsum.photos/seed/music/800/450",
  },
  {
    title: "Tech Talks Conference",
    description:
      "Lightning talks and panels from engineers and designers across the region.",
    startAt: daysFromNow(30),
    endAt: plusHours(daysFromNow(30), 6),
    location: "Downtown Convention Center, San Francisco, CA",
    maxAttendees: 120,
    status: "upcoming",
    imageUrl: "https://picsum.photos/seed/techtalks/800/450",
  },
  {
    title: "Intimate Jazz Night",
    description:
      "A cozy evening of live jazz. Limited seating — reserve your spot early.",
    startAt: daysFromNow(10),
    endAt: plusHours(daysFromNow(10), 3),
    location: "The Blue Note, Portland, OR",
    maxAttendees: 3,
    status: "upcoming",
    imageUrl: "https://picsum.photos/seed/jazz/800/450",
  },
  {
    title: "Startup Networking Mixer",
    description:
      "Meet founders, engineers, and investors over drinks and casual conversation.",
    startAt: daysFromNow(3),
    endAt: plusHours(daysFromNow(3), 2),
    location: "Riverton Hotel, Denver, CO",
    maxAttendees: 60,
    status: "ongoing",
    imageUrl: "https://picsum.photos/seed/mixer/800/450",
  },
  {
    title: "Sustainable Cities Talk",
    description:
      "A past event: a discussion on urban sustainability and community planning.",
    startAt: daysFromNow(-30),
    endAt: plusHours(daysFromNow(-30), 2),
    location: "Greenwood Library, Portland, OR",
    maxAttendees: 80,
    status: "completed",
    imageUrl: "https://picsum.photos/seed/cities/800/450",
  },
  {
    title: "Winter Gala (Cancelled)",
    description: "This event has been cancelled.",
    startAt: daysFromNow(14),
    endAt: plusHours(daysFromNow(14), 4),
    location: "Grand Hall, Denver, CO",
    maxAttendees: 100,
    status: "cancelled",
    imageUrl: "https://picsum.photos/seed/gala/800/450",
  },
];

// --- runner ----------------------------------------------------------------

async function seed(): Promise<void> {
  await connectDB();

  const dbName = mongoose.connection.name;

  // Guard against accidentally seeding a production database.
  if (/prod/i.test(dbName)) {
    throw new Error(
      `Refusing to run: database name "${dbName}" looks like production.`,
    );
  }
  console.log(`[seed] Connected to database: ${dbName}`);

  // Clean slate (dev only).
  await Promise.all([User.deleteMany({}), Event.deleteMany({})]);
  console.log("[seed] Cleared existing users / events");

  // Hash passwords, then strip the raw password before insertion.
  const usersToInsert = await Promise.all(
    SEED_USERS.map(async ({ password, ...rest }) => ({
      ...rest,
      passHash: await bcrypt.hash(password, 10),
    })),
  );

  const createdUsers = await User.create(usersToInsert);
  const createdEvents = await Event.create(SEED_EVENTS);

  console.log(
    `[seed] Inserted ${createdUsers.length} users and ${createdEvents.length} events`,
  );

  // Summary of test accounts (never print passHash).
  console.log("\n[seed] Test accounts:");
  for (const u of SEED_USERS) {
    console.log(`  [${u.role}] ${u.email}  /  ${u.password}`);
  }
  console.log(
    "\n[seed] Note: 'Intimate Jazz Night' has maxAttendees=3 to test the full-event flow.\n",
  );
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err: unknown) => {
    console.error("[seed] Failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  });
