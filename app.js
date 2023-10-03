const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const exp = require("constants");

let db = null;
let COLLECTION_NAME = "students";
async function connectDB() {
  try {
    let uri = "";
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("cs571-2023-10");
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

const app = express();

//middleware
app.use(express.json());

app.post("/students", async (req, res) => {
  try {
    const student = req.body;
    const ret = await db.collection(COLLECTION_NAME).insertOne(student);
    res.status(200).send({ success: true, data: ret });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error: "Cannot create this student" });
  }
});
app.get("/students", async (req, res) => {
  try {
    const ret = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.status(200).send({ success: true, data: ret });
  } catch (error) {
    res.status(500).send({ success: false, error: "Server Error" });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    const ret = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).send({ success: true, data: ret });
  } catch (error) {
    res.status(500).send({ success: false, error: "Server Error" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    // const ret = await db
    //   .collection(COLLECTION_NAME)
    //   .updateMany(
    //     { grades: {$elemMatch: {$gt: 10}}},
    //     { $set: { "grades.$": 15 } }
    //   );
    const ret = await db
      .collection(COLLECTION_NAME)
      .updateOne(
        {_id: new ObjectId(req.params.id)},
        { $set: { "grades.$[x]": 40} },
        {arrayFilters: [{x: {$gt: 10}}]}
      );
    res.status(200).send({ success: true, data: ret });
  } catch (error) {
    res.status(500).send({ success: false, error: "Server Error" });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
