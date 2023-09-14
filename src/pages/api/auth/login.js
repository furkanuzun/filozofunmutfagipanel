import connectToDatabase from "src/utils/dbConnection";
import { generateAccessToken, generateRefreshToken } from "./tokens";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, auth_time } = req.body;
    const user = await db.collection("users").findOne({ id });

    let userFromDB;

    // Tokenları oluştur ve döndür
    const accessToken = await generateAccessToken(user ? user : { id, auth_time });
    const refreshToken = await generateRefreshToken(user ? user : { id, auth_time });

    if (user) {
      const updatedUser = await db
        .collection("users")
        .updateOne({ id }, { $set: { accessToken, refreshToken } }, { upsert: true, multi: false });
    }
    // Yeni kullanıcı oluştur
    if (!user) {
      const createdUser = await db
        .collection("users")
        .insertOne({ ...req.body, isPro: false, accessToken, refreshToken });
    }

    userFromDB = await db.collection("users").findOne({ id });

    res.status(200).json({
      message: user ? "Giriş yapıldı." : "Kayıt yapıldı.",
      user: userFromDB,
      accessToken,
      refreshToken,
      isUserExist: user ? true : false,
    });
  } else {
    res.status(405).end();
  }
}
