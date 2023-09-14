import connectToDatabase from "src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const users = await db.collection("users").find({ isPro: true }).toArray();
  res.status(201).json({ users });
}

export default handler;
