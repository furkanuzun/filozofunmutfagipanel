import { ObjectId } from "mongodb";
import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();
  if (req.method !== "PUT") {
    res.status(400).json({ error: "Wrong method" });
  }
  console.log(req.body);
  const { _id } = req.body;
  const myObject = {};
  for await (const [key, value] of Object.entries(req.body)) {
    if (key !== "_id") {
      myObject[key] = value;
    }
  }
  const category = await db
    .collection("calorieMeters")
    .updateOne({ _id: new ObjectId(_id) }, { $set: myObject });
  res.status(201).json({ category });
}

export default handler;

