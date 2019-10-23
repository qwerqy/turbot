import { isDevMode } from "./../utilities";
import { MongoClient, Collection } from "mongodb";

export let guilds: Collection;

//TODO: SET ROLE ONLY ADMIN CAN ACCESS THIS. CREATE A MIDDLEWARE
(async () => {
  // Connection URL
  const url = !isDevMode
    ? process.env.MONGODB_STRING
    : "mongodb://localhost:27018";

  if (!url) {
    throw new Error("MongoDB URL not set!");
  }

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
