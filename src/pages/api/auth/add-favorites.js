import { ObjectId } from "mongodb";
import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, item, isFavorite } = req.body;
    console.log("--item", item);

    let user;
    if (!isFavorite) {
      user = await db.collection("users").updateOne({ id }, { $push: { favorilerim: item } });
    } else {
      user = await db
        .collection("users")
        .updateOne({ id }, { $pull: { favorilerim: { _id: item._id } } });
    }
    const favorites = await db.collection("users").findOne({ id });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    }

    res
      .status(200)
      .json({ message: "Kullanıcı bilgileri güncellendi.", favorilerim: favorites.favorilerim });
  } else {
    res.status(405).end();
  }
}
