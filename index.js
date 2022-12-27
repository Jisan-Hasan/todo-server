const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// define port
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// database setup
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run(){

}
run().catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send("Server is running!");
});

// listen port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});