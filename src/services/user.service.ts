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

/**
 * Creates a new admin user in the database
 * @param {Object} userData - The user data object containing name, email, username, and passHash
 * @returns {Promise<Object>} The created admin user object (excluding password hash)
 */
export async function createAdminUser(userData: { name: string; email: string; username: string; passHash: string }) {
    try {
        await connectDB();

        const newAdmin = await User.create({
            ...userData,
            role: "admin", // Force the role to be admin
        });

        // Convert Mongoose document to plain object and exclude passHash
        const { passHash, ...adminResponse } = newAdmin.toObject();

        return adminResponse;
    } catch (error) {
        console.error("Error creating admin user:", error);

        throw new Error("Failed to create admin user in database");
    }
}

/**
 * Updates an existing user by ID in the database
 * @param {string} userId - The ID of the user to update
 * @param {Object} updateData - The fields to update
 * @returns {Promise<Object|null>} The updated user object (excluding password hash)
 */
export async function updateUser(userId: string, updateData: Partial<{ name: string; email: string; username: string; role: string }>) {
    try {
        await connectDB();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-passHash").lean();

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user in database");
    }
}