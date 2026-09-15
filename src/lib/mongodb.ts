import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "No mongodb URI found. Please define the MONGODB_URI environment variable"
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * @function connectDB
 * @description Connects to the MongoDB database using Mongoose. Using a singleton pattern to ensure that the connection is reused
 * @async
 * @returns {Promise<typeof mongoose>} A promise that resolves to the Mongoose connection object
 * @throws {Error} Throws an error if the connection fails
 * @returns {Promise<typeof mongoose>} A promise that resolves to the Mongoose connection object
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}