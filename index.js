const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbqhd62.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db("emajohn").collection("products");
        app.get("/products", async (req, res) => {
            const query = {};
            const currentPage = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const cursor = productsCollection.find(query);

            const products = await cursor.skip(currentPage * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products })
        });

        app.post("/productsById", async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id));

            const query = { _id: { $in: objectIds } };

            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(error => console.log(error));


app.get("/", (req, res) => {
    res.send("Ema john is running");
})

app.listen(port, () => {
    console.log("ema john server is running at ", port);
})