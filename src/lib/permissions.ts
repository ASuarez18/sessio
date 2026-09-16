import { getCurrentUser } from "@/lib/auth";
import { PublicUser } from "@/services/auth.service";

/**
 * @function requireUser
 * @desc Ensures that a user is authenticated. If not, throws an error
 * @returns {Promise<PublicUser>} The authenticated user's public information
 */
export async function requireUser(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * @function requireAdmin
 * @desc Ensures that the authenticated user has admin privileges. If not, throws an error
 * @returns {Promise<PublicUser>} The authenticated admin user's public information
 */
export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}