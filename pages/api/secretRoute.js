import jwt from "jsonwebtoken";

const secretKey = "filozof-8563-F"; // Geliştirmeniz gereken gizli anahtar

export default function secureRoute(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Yetkilendirme hatası. Token bulunamadı." });
    }

    try {
      const decodedToken = jwt.verify(token, secretKey);

      console.log("--decodedToken", decodedToken);
      // Burada kullanıcının yetkilerini kontrol edebilirsiniz.
      // Örneğin, kullanıcının rolüne veya diğer verilere göre yetkilendirme yapabilirsiniz.

      // Örnek olarak, yetkilendirme başarılı ise işlemi devam ettir.
      return await handler(req, res);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Geçersiz token. Oturumunuzun süresi dolmuş olabilir." });
    }
  };
}
