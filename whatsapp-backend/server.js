//importing
// const express = require('express');
import express from "express";
//app config
const app = express();
const PORT = process.env.PORT || 9000;
//middleware

//DB config

//???

//api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

//listener
app.listen(PORT, () => console.log(`Listening to LocalHost: ${PORT}`));

//201->created
//200->OK
//404->NOT FOUND
