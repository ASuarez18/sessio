import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/Session";
import { IUser, User } from "@/models/User";

const SESSION_24H_MS = 24 * 60 * 60 * 1000;
const SESSION_30DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export type PublicUser = Pick<IUser, "name" | "email" | "username" | "role"> & {
  id: string;
};

type AuthenticatedSession = {
  user: PublicUser;
  token: string;
  expiresAt: Date;
};

function toPublicUser(
  user: { _id: mongoose.Types.ObjectId } & IUser,
): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
  };
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * @function registerUser
 * @desc Registers a new user in the database after validating that the email is unique and hashing the password
 * @param {string} name - name of the user to be registered
 * @param {string} email -  email of the user to be registered, must be unique
 * @param {string} password -  password of the user to be registered, will be hashed before storing in the database
 * @throws {Error} if an account with the provided email already exists
 * @returns {PublicUser} - the newly created user object with public fields only
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  username: string,
): Promise<PublicUser> {
  await connectDB();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const existingEmail = await User.findOne({ email: normalizedEmail }).exec();
  if (existingEmail) {
    throw new Error("An account with this email already exists");
  }

  const existingUsername = await User.findOne({
    username: normalizedUsername,
  }).exec();
  if (existingUsername) {
    throw new Error("An account with this username already exists");
  }

  const passHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    username: normalizedUsername,
    passHash,
    role: "user",
  });

  return toPublicUser(user);
}

/**
 * @function authenticateUser
 * @desc Authenticates user credientials and creates a session for the user if the credentials are valid
 * @param {user} email - email of the user to be authenticated, must match an existing user in the database
 * @param {user} password -  password of the user to be authenticated
 * @throws {Error} if the email or password is invalid
 * @returns {user: PublicUser, token: string, expiresAt: Date} - the authenticated user object with public fields only, session token, and expiration date
 */
export async function authenticateUser(
  identifier: string,
  password: string,
  rememberMe?: boolean,
): Promise<AuthenticatedSession> {
  if (!identifier) {
    throw new Error("Email or username is required");
  }

  await connectDB();
  const normalizedIdentifier = identifier.trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
  })
    .select("+passHash")
    .exec();

  if (!user || !(await bcrypt.compare(password, user.passHash))) {
    throw new Error("Invalid email/username or password");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const sessionDuration = rememberMe ? SESSION_30DAYS_MS : SESSION_24H_MS;
  const expiresAt = new Date(Date.now() + sessionDuration);

  await Session.create({
    userId: user._id,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return { user: toPublicUser(user), token, expiresAt };
}

/**
 * @function getUserFromSession
 * @desc Retrieves a user from the database based on a session token, if the session is valid and not expired
 * @param {string} token - the session token to look up the user
 * @throws {Error} if there is a server error while retrieving the user
 * @returns {Promise<User | null>} - the user object if found and valid, or null if not found or session is expired
 */
export async function getUserFromSession(
  token: string,
): Promise<PublicUser | null> {
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

/**
 * @function destroySession
 * @desc Deletes a session from the database based on the provided session token
 * @param {string} token - the session token to be destroyed
 * @throws {Error} if there is a server error while destroying the session
 * @returns {Promise<void>} - resolves when the session is successfully destroyed
 */
export async function destroySession(token: string): Promise<void> {
  await connectDB();
  await Session.deleteOne({ tokenHash: hashToken(token) }).exec();
}

/**
 * @function createSessionForUser
 * @desc Creates a new session for a user and returns the session token and expiration date
 * @param {string} userId - The ID of the user for whom the session is being created
 * @throws {Error} if there is a server error while creating the session
 * @returns {token: string, expiresAt: Date} - The session token and expiration date
 */
export async function createSessionForUser(
  userId: string,
  rememberMe?: boolean,
) {
  await connectDB();
  const token = crypto.randomBytes(32).toString("hex");
  const sessionDuration = rememberMe ? SESSION_30DAYS_MS : SESSION_24H_MS;
  const expiresAt = new Date(Date.now() + sessionDuration);

  await Session.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return { token, expiresAt };
}
