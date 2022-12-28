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

async function run() {
    try {
        // all collections
        const taskCollection = client.db("todos").collection("tasks");

        /* ---------------------GET API----------------------------------- */
        // get all task by user email
        app.get("/task/:email", async (req, res) => {
            const email = req.params.email;
            const isComplete = req.query.isComplete === "false" ? false : true;
            const filter = { email: email, isCompleted: isComplete };
            const result = await taskCollection.find(filter).toArray();
            res.send({ status: true, data: result });
        });

        // get task by id
        app.get("/singleTask/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(filter);
            res.send({ status: true, data: result });
        });

        /* ---------------------POST API----------------------------------- */
        // save task in db
        app.post("/task", async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            if (result.insertedId) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        });

        /* ---------------------PATCH API----------------------------------- */
        // update task
        app.patch("/task/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };
            const doc = { $set: data };
            const result = await taskCollection.updateOne(filter, doc, options);
            if (result.modifiedCount) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        });

        /* ---------------------DELETE API----------------------------------- */
        // delete task by id
        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            if (result.deletedCount) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        });
    } finally {
    }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// listen port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
