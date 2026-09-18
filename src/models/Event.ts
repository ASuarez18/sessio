import mongoose, { Schema, Document, Model } from "mongoose";

export const EVENT_CATEGORIES = [
  "Data",
  "Web Dev",
  "UI design",
  "Design",
  "Software Engineering",
  "AI & ML",
  "Cybersecurity",
  "Cloud & DevOps",
  "Uncategorized",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface IEvent extends Document {
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  location: string;
  maxAttendees: number;
  category: EventCategory;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  imageUrl?: string;
  createdAt: Date;  
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    startAt: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endAt: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value: Date) {
          const doc = this as unknown as Record<string, unknown>;
          const startAt = doc.get && typeof doc.get === "function" 
            ? (doc.get("startAt") as Date | undefined)
            : (doc.startAt as Date | undefined);
          if (!startAt) return true; 
          return value > startAt;
        },
        message: "End date must be after start date",
      },
    },
    location: {
      type: String,
      required: [true, "Ubication is required"],
      trim: true,
    },
    maxAttendees: {
      type: Number,
      required: [true, "Max attendees is required"],
      min: [1, "Max attendees must be at least 1"],
    },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      default: "Uncategorized",
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true, // CreatedAt & UpdatedAt
  }
);

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;