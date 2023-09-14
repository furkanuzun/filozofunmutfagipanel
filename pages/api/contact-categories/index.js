import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const categories = await db.collection("contact-categories").find().toArray();
  res.status(201).json({ categories });
}

export default handler;
