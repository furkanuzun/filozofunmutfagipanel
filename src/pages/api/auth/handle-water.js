import connectToDatabase from "src/utils/dbConnection";
import checkIsToday from "src/utils/dateCheck";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, tarih, drinked } = req.body;
    const user = await db.collection("users").updateOne({ id }, { $set: { su_takibi: { tarih, drinked} } });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Kullanıcı bilgileri güncellendi.", user });
  } else {
    res.status(405).end();
  }
}

// SET
