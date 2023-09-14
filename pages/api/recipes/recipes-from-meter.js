import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { meter } = req.query;
  const recipes = await db.collection("recipes").find({ "kalori_sayaci._id": meter }).toArray();
  res.status(201).json({ recipes });
}

export default handler;
