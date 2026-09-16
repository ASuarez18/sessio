// services/user.service.ts
import { connectDB } from "../lib/mongodb";
import User from "../models/User";

/**
 * Fetches all users
 * @returns {Promise<Array>} An array of user objects (excluding password hashes).
 */

export async function getAllUsers() {
	try {
		await connectDB();

		// Fetch all users with Mongoose
		const users = await User.find({}).select("-passHash").lean();

		return users;
	} catch (error) {
		console.error("Error fetching users:", error);

		throw new Error("Failed to fetch users from database");
	}
}

/**
 * Fetches only admin users
 */
export async function getAdminUsers() {
    try {
        await connectDB();
        const admins = await User.find({ role: "admin" }).select("-passHash").lean();
        return admins;
    } catch (error) {
        console.error("Error fetching admin users:", error);
        throw new Error("Failed to fetch admin users from database");
    }
}
