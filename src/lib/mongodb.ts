import { MongoClient, ObjectId } from "mongodb";

// export type Post = {
//   title: string;
//   content: string;
//   user: ObjectId;
//   tags: string[];
//   createdAt: Date;
// };

// export type User = {
//   name: string;
//   email: string;
//   age?: number;
// };

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db();

// export const users = db.collection("users");
// export const posts = db.collection<Post>("posts");

// console.log(users.find())
