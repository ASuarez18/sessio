import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISession {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export type SessionDocument = ISession & Document;

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<SessionDocument> =
  (mongoose.models.Session as Model<SessionDocument> | undefined) ??
  mongoose.model<SessionDocument>("Session", sessionSchema);
