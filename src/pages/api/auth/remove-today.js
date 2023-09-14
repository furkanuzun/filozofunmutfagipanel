import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, tarih } = req.body;
    const user = await db
      .collection("users")
      .updateOne({ id }, { $pull: { yediklerim: { tarih } } });
    const editedUser = await db.collection("users").findOne({ id });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    }

    res
      .status(200)
      .json({ message: "Kullanıcı bilgileri güncellendi.", user, recipes: editedUser.yediklerim });
  } else {
    res.status(405).end();
  }
}
