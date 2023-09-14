import connectToDatabase from "src/utils/dbConnection";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { db } = await connectToDatabase();
    const { id, gunluk_degerler, program_bilgileri } = req.body;
    console.log("--id", id);
    console.log("--body", req.body);

    const user = await db
      .collection("users")
      .updateOne(
        { id },
        { $set: { gunluk_degerler, program_bilgileri } },
        { upsert: true, multi: false }
      );
    const updatedUser = await db.collection("users").findOne({ id });

    if (!user) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Kullanıcı bilgileri güncellendi.", user: updatedUser });
  } else {
    res.status(405).end();
  }
}
