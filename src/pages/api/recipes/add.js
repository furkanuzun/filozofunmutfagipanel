import connectToDatabase from "src/utils/dbConnection";
import secureRoute from '../secretRoute';

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  console.log(req.body);
  const { db } = await connectToDatabase();
  const result = await db.collection("recipes").insertOne({ ...req.body });

  const recipes = await db.collection("recipes").find().toArray();

  return res.status(200).json({
    result,
    recipes,
  });
}

export default handler