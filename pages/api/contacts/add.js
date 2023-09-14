import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { db } = await connectToDatabase();
  const { kategori_id, kategori_adi, cevaplanma, baslik, mesaj, user } = req.body;
  const result = await db.collection("contacts").insertOne({
    kategori_id,
    baslik,
    mesaj,
    kategori_adi,
    cevaplanma,
    user,
    createdAt: new Date(),
    isBoxed: false,
  });

  return res.status(200).json({
    result,
  });
}
