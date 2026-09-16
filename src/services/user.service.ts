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
