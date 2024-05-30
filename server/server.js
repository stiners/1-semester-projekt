const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const db = require("./queries");
const port = process.env.PORT || 4000;
// const foodItem = document.getElementById("foodItem");
// const foodCategory = document.getElementById("foodCategory");

require("dotenv").config();

const path = require("path");
const { request } = require("http");

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.options("*", cors());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
  // response.sendFile(__dirname + "/index.html");
});
app.get("/category/:kategori", db.fetchCategoryData);
app.get("/foods", db.getFoods);
app.post("/insert-food", db.insertFood);
app.post("/populateFoods", db.populateFoods);
// app.get("/foodItem", db.foodItem);
// app.get("/foodCategory", db.foodCategory);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
