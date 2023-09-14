import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const latestSubscriptions = await db
    .collection("earnings")
    .find()
    .sort({ $natural: -1 })
    .limit(10)
    .toArray();
  res.status(201).json({ latestSubscriptions });
}

export default handler;
