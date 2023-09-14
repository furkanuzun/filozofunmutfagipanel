import connectToDatabase from "../../../src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, item } = req.body;
    console.log(req.body);
    const user = await db.collection("users").updateOne({ id }, { $push: { manuel_makro: item } });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Kullanıcı bilgileri güncellendi.", user });
  } else {
    res.status(405).end();
  }
}
