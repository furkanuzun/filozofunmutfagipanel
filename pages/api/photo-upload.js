import formidable from "formidable";
import mime from "mime";

export const config = {
  api: {
    bodyParser: false, // bodyParser'ı devre dışı bırakın, formidable kendi parser'ını kullanacak
  },
};
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const form = formidable({
    uploadDir: "./public/uploads", // Yüklenen dosyaların saklanacağı dizin
    keepExtensions: true, // Dosya uzantısını koru
    maxFileSize: 5 * 1024 * 1024, // Maksimum dosya boyutu (5 MB),
    filename: (_name, _ext, part) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${part.name || "unknown"}-${uniqueSuffix}.${
        mime.getExtension(part.mimetype || "") || "unknown"
      }`;
      return filename;
    },
  });

  form.parse(req, async (err, fields, files) => {
    // const name = path.basename("--path", files.image.toJSON());
    if (err) {
      return res.status(500).json({ error: "Dosya yükleme işlemi başarısız oldu." });
    }

    // fields: formdaki diğer alanları içerir (JSON verisi gibi)
    // files: yüklenen dosyaları içerir

    // const { username, email } = fields; // JSON verisini al

    if (!files.image) {
      return res.status(400).json({ error: "Lütfen bir resim seçin!" });
    }

    const { newFilename } = files.image[0]; // "filepath" değerine destructuring ile erişim

    if (!newFilename) {
      return res.status(400).json({ error: "Dosya yolu bulunamadı!" });
    }

    // Buradan itibaren dosya ve diğer verilerle ne yapmak istediğinize karar verebilirsiniz.
    return res.status(200).json({
      url: newFilename,
    });
  });
}
