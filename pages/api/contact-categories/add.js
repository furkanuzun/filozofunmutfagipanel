import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  console.log(req.body);
  const { db } = await connectToDatabase();
  const result = await db.collection("contact-categories").insertOne({ ...req.body, createdAt: new Date() });

  const categories = await db.collection("contact-categories").find().toArray();

  return res.status(200).json({
    result,
    categories,
  });
}
