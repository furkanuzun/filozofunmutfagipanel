import connectToDatabase from "src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const { category } = req.query;

  const recipes = await db
    .collection("recipes")
    .find({ kategoriler: { $elemMatch: { _id: category } } })
    .toArray();

  res.status(201).json({ recipes });
}

export default handler;
