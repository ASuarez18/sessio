import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { connectDB } from "../lib/mongodb";
import User, { IUser } from "../models/User";
import Event, { IEvent, EventCategory } from "../models/Event";
import Registration, { IRegistration } from "../models/Registration";

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

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
  | "category"
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

// 8 categories (excluding "Uncategorized") × 5 = 40 events, evenly distributed.
const CATEGORIES: EventCategory[] = [
  "Data",
  "Web Dev",
  "UI design",
  "Design",
  "Software Engineering",
  "AI & ML",
  "Cybersecurity",
  "Cloud & DevOps",
];

const TITLE_TEMPLATES = [
  "Fundamentals",
  "Bootcamp",
  "Masterclass",
  "Workshop",
  "Deep Dive",
];

const LOCATIONS = [
  "Tech Hub Barcelona",
  "Campus Nord UPC",
  "Online — Live",
  "Disseny Hub Barcelona",
  "IESE Business School",
];

const EVENTS_PER_CATEGORY = TITLE_TEMPLATES.length;

const SEED_EVENTS: SeedEvent[] = CATEGORIES.flatMap((category, categoryIndex) =>
  TITLE_TEMPLATES.map((template, templateIndex) => {
    const index = categoryIndex * EVENTS_PER_CATEGORY + templateIndex; // 0..39
    const dayOffset = (index - 12) * 4; // spread across past and future
    const startAt = daysFromNow(dayOffset);
    return {
      title: `${category} ${template}`,
      description: `A hands-on ${template.toLowerCase()} focused on ${category}.`,
      startAt,
      endAt: plusHours(startAt, 2 + (templateIndex % 3)),
      location: LOCATIONS[index % LOCATIONS.length],
      maxAttendees: 20 + (templateIndex % 5) * 10,
      category,
      status: dayOffset < 0 ? "completed" : "upcoming",
      imageUrl: `https://picsum.photos/seed/${slugify(category)}-${index}/800/450`,
    };
  }),
);

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
  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
  ]);
  console.log("[seed] Cleared existing users / events / registrations");

  // Hash passwords, then strip the raw password before insertion.
  const usersToInsert = await Promise.all(
    SEED_USERS.map(async ({ password, ...rest }) => ({
      ...rest,
      passHash: await bcrypt.hash(password, 10),
    })),
  );

  const createdUsers = await User.create(usersToInsert);
  const createdEvents = await Event.create(SEED_EVENTS);

  // Registrations: give the first regular users a few upcoming sessions each,
  // and leave the last regular user with no registrations (empty state).
  const now = Date.now();
  const upcomingEvents = createdEvents.filter(
    (event) => new Date(event.startAt).getTime() >= now,
  );

  const regularUsers = createdUsers.slice(1); // exclude admin
  const registeringUsers = regularUsers.slice(0, regularUsers.length - 1);
  const emptyUser = regularUsers[regularUsers.length - 1];

  const registrationsToInsert = registeringUsers.flatMap((user, userIndex) =>
    Array.from({ length: 3 }, (_, offset) => {
      const event =
        upcomingEvents[(userIndex * 3 + offset) % upcomingEvents.length];
      return {
        user: user._id as mongoose.Types.ObjectId,
        event: event._id as mongoose.Types.ObjectId,
        status: (offset % 2 === 0
          ? "confirmed"
          : "registered") as IRegistration["status"],
      };
    }),
  );

  await Registration.create(registrationsToInsert);

  console.log(
    `[seed] Inserted ${createdUsers.length} users, ${createdEvents.length} events, ${registrationsToInsert.length} registrations`,
  );
  console.log(
    `[seed] Categories: ${CATEGORIES.length} × ${EVENTS_PER_CATEGORY} events each`,
  );
  console.log(`[seed] User with no registrations: ${emptyUser.email}`);

  console.log("\n[seed] Test accounts:");
  for (const u of SEED_USERS) {
    console.log(`  [${u.role}] ${u.email}  /  ${u.password}`);
  }
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
