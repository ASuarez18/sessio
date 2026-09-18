import mongoose, { Document, Model, Schema } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
	name: string;
	email: string;
  username?: string;
	passHash: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
}

export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
    username: {
      type: String,
			required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
      sparse: true,
    },
		passHash: { type: String, required: true, select: false },
		role: { type: String, enum: ["user", "admin"], default: "user", required: true },
	},
	{ timestamps: true },
);

export const User: Model<UserDocument> =
	(mongoose.models.User as Model<UserDocument> | undefined) ??
	mongoose.model<UserDocument>("User", userSchema);

export default User;
