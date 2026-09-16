import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import { Session } from "../models/Session";
import { IUser, User } from "../models/User";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export type PublicUser = Pick<IUser, "name" | "email" | "role"> & { id: string };

type AuthenticatedSession = {
  user: PublicUser;
  token: string;
  expiresAt: Date;
};

function toPublicUser(user: { _id: mongoose.Types.ObjectId } & IUser): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function registerUser(name: string, email: string, password: string): Promise<PublicUser> {
  await connectDB();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail }).exec();

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passHash,
    role: "user",
  });

  return toPublicUser(user);
}

export async function authenticateUser(email: string, password: string): Promise<AuthenticatedSession> {
  await connectDB();
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passHash").exec();

  if (!user || !(await bcrypt.compare(password, user.passHash))) {
    throw new Error("Invalid email or password");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await Session.create({ userId: user._id, tokenHash: hashToken(token), expiresAt });

  return { user: toPublicUser(user), token, expiresAt };
}

export async function getUserFromSession(token: string): Promise<PublicUser | null> {
  await connectDB();
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).exec();

  if (!session) {
    return null;
  }

  const user = await User.findById(session.userId).exec();
  return user ? toPublicUser(user) : null;
}

export async function destroySession(token: string): Promise<void> {
  await connectDB();
  await Session.deleteOne({ tokenHash: hashToken(token) }).exec();
}
