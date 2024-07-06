const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace the placeholders in the connection string uri with your credentials
const uri = import.meta.env.MONGODB_CONNECTION;

// Create a client with options to specify Stable API Version 1
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function pingMongo() {
  try {
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = pingMongo;
