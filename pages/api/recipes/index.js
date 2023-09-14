import connectToDatabase from "../../../src/utils/dbConnection";
import secureRoute from "../secretRoute";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const recipes = await db.collection("recipes").find().toArray();
  res.status(201).json({ recipes });
}

export default handler;
