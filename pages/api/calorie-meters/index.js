import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const calorieMeters = await db.collection("calorieMeters").find().toArray();
  res.status(201).json({ calorieMeters });
}

export default handler;
