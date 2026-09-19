import { connectDB } from "@/lib/mongodb";
import Event from "./Event";

export async function getCategoryCountsFromDB(): Promise<Array<{ category: string; count: number }>> {
  try {
    await connectDB();

    const counts = await Event.aggregate([
      {
        $match: {
          status: { $in: ["upcoming", "ongoing"] },
          category: { $ne: "Uncategorized" },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    return counts.map((item) => ({
      category: item._id,
      count: item.count,
    }));
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return [];
  }
}