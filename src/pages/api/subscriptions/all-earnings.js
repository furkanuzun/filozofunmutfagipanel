import connectToDatabase from "src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const earnings = await db.collection("earnings").find().sort({ $natural: -1 }).toArray();
  res.status(201).json({ earnings });
}

export default handler;
