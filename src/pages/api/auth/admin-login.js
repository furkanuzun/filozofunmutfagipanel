import connectToDatabase from "src/utils/dbConnection";
import { generateAccessToken, generateRefreshToken } from "./tokens";
import jwt from "jsonwebtoken";

const secretKey = "filozof-8563-F"; // Geliştirmeniz gereken gizli anahtar

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const { id, password } = req.body;
    const user = await db.collection("admins").findOne({ id, password });
    if (!user) {
      res.status(400).json({ error: "Kullanıcı adı veya şifre hatalı" });
    }

    const accessToken = jwt.sign({ id, password, date: new Date() }, secretKey, {
      expiresIn: "30d",
    });

    const refreshToken = Math.random().toString(36).slice(-8);

    // Tokenları oluştur ve döndür

    if (user) {
      const updatedUser = await db
        .collection("admins")
        .updateOne({ id }, { $set: { accessToken, refreshToken } }, { upsert: true, multi: false });
    }

    res.status(200).json({
      message: "Giriş yapıldı",
      accessToken,
      refreshToken,
    });
  } else {
    res.status(405).end();
  }
}
