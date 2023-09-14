import { ObjectId } from "mongodb";
import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();
  if (req.method !== "GET") {
    res.status(400).json({ error: "Wrong method" });
  }
  console.log(req.query);
  if (req.method === "GET") {
    const { _id } = req.query;
    const recipe = await db.collection("recipes").findOne({ _id: new ObjectId(_id) });
    res.status(201).json({ recipe });
  }
}

export default handler;
