const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4g4am.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("products2");
    const productsCollection = database.collection("productsCollection");
    // get api
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();
      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send({
        count,
        products,
      });
      //post get data by keys
      app.post("/products/byKeys", async (req, res) => {
        const keys = req.body;
        const query = { key: { $in: keys } };
        const products = await productsCollection.find(query).toArray();
        res.json(products);
      });
    });

    console.log(`A document was inserted with the _id`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
// for ema john
//user 2
//user:mydbuser2
//pass:qCIIddQv0Oz7yGep
//

// const { MongoClient } = require("mongodb");
// const uri =
//   "mongodb+srv://<username>:<password>@cluster0.4g4am.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

//for network
//user:mydbuser3
//pass:nFOwuPKxfkG285k8

//for assignment
//user:mydbuser4
//pass:ZNZSmsthVI3DjoRd
//environment var:npm install dotenv
//require env:require('dotenv').config()
