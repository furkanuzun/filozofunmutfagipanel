import { MongoClient } from "mongodb";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(
    "mongodb+srv://furkanuzun:mongo8563M@cluster0.thdascn.mongodb.net/",
    // PROD MONGO: "mongodb://root:filozof8563F@127.0.0.1:27017/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  client.on("error", console.error.bind(console, "connection error: "));
  client.once("open", function () {
    console.log("Connected successfully");
  });

  const db = client.db("filozofunmutfagi");

  cachedClient = {
    client,
    db,
  };

  return cachedClient;
}

export default connectToDatabase;
