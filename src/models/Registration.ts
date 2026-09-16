import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  registeredAt: Date;
  status: "registered" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["registered", "confirmed", "cancelled"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  }
);

RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;