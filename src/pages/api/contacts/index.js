import connectToDatabase from "src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const contacts = await db.collection("contacts").find().sort({ $natural: -1 }).toArray();
  res.status(201).json({ contacts });
}

export default handler;
