import { MongoClient, Collection } from "mongodb";

export let guilds: Collection;

(async () => {
  // Connection URL
  const url = process.env.MONGODB_STRING || "mongodb://localhost:27018";

  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    // Use connect method to connect to the Server
    await client.connect();
    console.log(`Connected to ${url}`);

    const db = client.db("turbotDB");

    guilds = db.collection("guilds");
  } catch (err) {
    console.log(err.stack);
  }
})();
