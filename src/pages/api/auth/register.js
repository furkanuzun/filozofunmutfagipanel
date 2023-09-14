import connectToDatabase from "src/utils/dbConnection";
import { generateAccessToken, generateRefreshToken } from "./tokens";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }
  const { id, password } = req.body;

  console.log("--reqbody", req.body);
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ id });

  // Kullanıcı adının benzersiz olduğunu kontrol et
  if (user) {
    return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor." });
  }

  // Yeni kullanıcı oluştur
  const newUser = {
    id,
    password,
  };

  // Kayıt başarılı, tokenları oluştur ve döndür
  const accessToken = await generateAccessToken(newUser);
  const refreshToken = await generateRefreshToken(newUser);

  const registeredUser = await db
    .collection("users")
    .insertOne({ ...req.body, accessToken, refreshToken });
  console.log("--registeredUser", registeredUser);

  res.status(201).json({
    message: "Kullanıcı başarıyla kaydedildi.",
    user: registeredUser,
    accessToken,
    refreshToken,
  });
}

export default handler;
