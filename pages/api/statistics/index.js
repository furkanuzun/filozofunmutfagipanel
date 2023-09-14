// kullanıcı sayısı, toplam kazanç bilgilerini getir

// Path: src/pages/api/statistics/index.js

import connectToDatabase from "../../../src/utils/dbConnection";

async function handler(req, res) {
  const { db } = await connectToDatabase();

  const usersCount = await db.collection("users").count();
  const totalEarnings = await db.collection("earnings").find().toArray();
  const unboxedContacts = await db.collection("contacts").count({ isBoxed: false });

  let totalEarningsAmount = 0;
  await totalEarnings.map((earning) => {
    totalEarningsAmount += parseInt(earning.product.price);
  });

  res.status(201).json({ usersCount, totalEarningsAmount, unboxedContacts });
}

export default handler;
