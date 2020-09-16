//importing
// const express = require('express');
import express from "express";
import mongoose from "mongoose";
//import dbmessages from "./dbmessages";
import Messages from "./dbmessages.js";
import Pusher from "pusher";
//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1073859",
  key: "5cf7e3ced7958060410c",
  secret: "a2950edc83a36f12c93b",
  cluster: "ap2",
  encrypted: true,
});
//middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin," * "");
  res.setHeader("Access-Control-Allow-Headers," * "");
  next();
});
//DB config
const connection_url =
  "mongodb+srv://user01:lionking@cluster0.hf4yx.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//???
const db = mongoose.connection;
db.once("open", () => {
  console.log("db is connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
      });
    } else {
      console.log(`Errro triggering Pusher`);
    }
  });
});
//api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//listener
app.listen(port, () => console.log(`Listening to LocalHost: ${port}`));

//201->created
//200->OK
//404->NOT FOUND
