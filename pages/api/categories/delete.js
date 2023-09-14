import { ObjectId } from "mongodb";
import connectToDatabase from "src/utils/dbConnection";

export default async function deleteRecipe(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).end("Method Not Allowed");
  }
  const { _id } = req.query;
  const { db } = await connectToDatabase();
  const result = await db.collection("categories").deleteOne({ _id: new ObjectId(_id) });

  console.log(result);
  return res.status(200).json({
    result,
  });
}
