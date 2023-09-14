import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  console.log(req.body);
  const { db } = await connectToDatabase();
  const result = await db.collection("calorieMeters").insertOne({ ...req.body, createdAt: new Date() });

  const calorieMeters = await db.collection("calorieMeters").find().toArray();

  return res.status(200).json({
    result,
    calorieMeters,
  });
}
