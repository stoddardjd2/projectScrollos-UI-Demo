const express = require("express");
const cors = require("cors");

// Run npm install mongodb and require mongodb and MongoClient class
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3001;
// Connection string to instance of MongoDB
const connectionStringURI = `mongodb+srv://stoddardjd2:YB4SuEe0xlgK4AGP@cluster0.4lwuhru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Initialize a new instance of MongoClient
const client = new MongoClient(connectionStringURI);
// Declare a variable to hold the connection
let db;
// Create variable to hold our database name
const dbName = "API-Directory";
// Use connect method to connect to the mongo server
client
  .connect()
  .then(() => {
    console.log("Connected successfully to MongoDB");
    // Use client.db() constructor to add new db instance
    db = client.db(dbName);
    // start up express server
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection error: ", err.message);
  });
// Built in Express function that parses incoming requests to JSON
app.use(express.json());
// enables CORS (cross-origin resource sharing) in order for server to be accessible by other origins (domains).
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//get specific api doc using id
app.get("/read/getId/:id", (req, res) => {
  db.collection("API documents")
    .findOne(new ObjectId(req.params.id))
    .then((results) => res.json(results))
    .catch((err) => {
      if (err) throw err;
    });
});

// read database, limit to returning amount in parameters
app.get("/read/limitResults/:limit", (req, res) => {
  const { limit } = req.params;
  db.collection("API documents")
    .find()
    //convert to int for limit to work using +
    .limit(+limit)
    .project({ info: 1, _id: 1, opennapi: 1, servers: 1 })
    .toArray()
    .then((results) => res.json(results))
    .catch((err) => {
      if (err) throw err;
    });
});

//return user data using userID
app.get("/user/:userID", (req, res) => {
  console.log("user req by id recvieved");
  const id = req.params.userID;
  try {
    db.collection("Users")
      // .findOne({"_id" : new ObjectId("66a1689870d0f4ce17d52f03")})
      .findOne({ _id: new ObjectId(id) })
      .then((results) => res.json(results))
      .catch((err) => {
        if (err) throw err;
      });
  } catch (error) {
    console.log("invalid params");
    res.status(404).send("invalid parameters");
  }
});

//save apiDocID to type for userID
//options: recents, saved
app.patch("/user/:userID/save/:type", (req, res) => {
  console.log("BOOKMARK REQ RECEIVED!");
  const { userID, type } = req.params;
  const { docID } = req.body;
  db.collection("Users")
    .updateOne({ _id: new ObjectId(userID) }, { $push: { [type]: docID } })
    .then(res.send("patch successful, saved!"))
    .catch((err) => {
      if (err) throw err;
    });
});
//save apiDocID to bookmarks for userID
app.delete("/user/:userID/remove/:type", (req, res) => {
  const { userID, type } = req.params;
  const { docID } = req.body;
  db.collection("Users")
    .updateOne({ _id: new ObjectId(userID) }, { $pull: { [type]: docID } })
    .then(res.send("patch succesful, unsaved!"))
    .catch((err) => {
      if (err) throw err;
    });
});

//for userID, get type and set limit on #of returned api info docs
app.get("/user/:userID/get/:type/:limit", async (req, res) => {
  console.log("LIMIT");
  const { userID, limit, type } = req.params;
  try {
    const array = await db
      .collection("Users")
      .find({ _id: new ObjectId(userID) }, { [type]: 1 })
      .project({ username: 0, password: 0})
      .toArray();
    //shorten array length of all types to limit value before sending

    const objIds = array[0][type].map((id) => {
      return new ObjectId(id);
    });
    console.log(objIds);
    //send "limited" arrays

    db.collection("API documents")
      .find({ _id: { $in: objIds } })
      .project({ info: 1, _id: 1, opennapi: 1, servers: 1 })
      .toArray()
      .then((results) => {
        console.log("results");
        console.log(results);
        res.json(results);
      });
  } catch (error) {
    console.log(error);
  }
});

// search database using string. returns INFO, _ID, OPENAPI, SERVERS
app.get("/search/title/:input", async (req, res) => {
  const { input } = req.params;
  console.log("search", { input });

  // await db.collection.createIndex({ info: "textIndex" });
  db.collection("API documents")
    .find({ "info.title": new RegExp(input, "i") })
    .project({ info: 1, _id: 1, opennapi: 1, servers: 1 })
    // {$regex:/api/}
    .toArray()
    .then((results) => {
      console.log(results);
      res.json(results);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// read database. returns INFO, _ID, OPENAPI, SERVERS
app.get("/read", (req, res) => {
  db.collection("API documents")
    .find()
    .project({ info: 1, _id: 1, opennapi: 1, servers: 1 })
    .toArray()
    .then((results) => res.json(results))
    .catch((err) => {
      if (err) throw err;
    });
});

app.post("/create", (req, res) => {
  const api = req.body;
  db.collection("API documents")
    .insertOne(api)
    .then((results) => res.json(results))
    .catch((err) => {
      if (err) throw err;
    });
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //check if username is used in collection
  const check = await db.collection("Users").findOne({ username: username });
  console.log(check);
  //check if result exists and deny if so
  if (check) {
    res.status(403).send("taken");
  } else {
    //if password/username combination does not exist, create new user and update database:
    db.collection("Users")
      .insertOne({ username: username, password: password })
      .catch((err) => {
        if (err) throw err;
      });
    res.status(201).send("notTaken");
  }
});

//search for document that matches username and password used in login request
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const check = await db
    .collection("Users")
    .findOne({ $and: [{ username: username }, { password: password }] })
    .catch((err) => {
      if (err) throw err;
    });
  //check if username+password has a match in database
  if (check) {
    const results = check;
    //remove password before sending user data to client
    delete results.password;
    res.status(202).send(results);
  } else {
    //username/password match not found:
    res.status(401).send("username/password not found!");
  }
});

//updates bookmarks
app.post("/save", (req, res) => {
  const { _id, bookmarks, recents } = req.body;
  console.log("SAVING:");
  console.log(req.body);
  db.collection("Users")
    // .findOne({"_id" : new ObjectId("66a1689870d0f4ce17d52f03")})
    .updateOne(
      { _id: new ObjectId(_id) },
      { $set: { bookmarks: bookmarks, recents: recents } }
    )
    .then(res.send("save successful"))
    .catch((err) => {
      if (err) throw err;
    });
});
