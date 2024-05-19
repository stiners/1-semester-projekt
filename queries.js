const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const fetchCategoryData = (request, response) => {
  const kategori = request.params.kategori;
  pool.query(
    `SELECT * FROM mad WHERE kategori_id = (
        SELECT id FROM mad_kategori WHERE kategori = $1
    )`,
    [kategori],
    (error, results) => {
      if (error) {
        console.error("Error fetching category data:", error);
        response.status(500).json({ error: "Internal server error" });
      } else {
        console.log("Fetched category data:", results.rows); // Log fetched data
        response.status(200).json(results.rows);
      }
    }
  );
};

//route for /foods
const getFoods = (request, response) => {
  pool.query("SELECT * FROM mad", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//route for /insert-food
const insertFood = (request, response) => {
  const {
    produkt,
    kategori,
    co2e_pr_kg,
    landbrug,
    iluc,
    forarbejdning,
    emballage,
    transport,
    detail,
  } = request.body;
  pool.query(
    `INSERT INTO food_tmp (produkt, kategori, co2e_pr_kg, landbrug, "ILUC", forarbejdning, emballage, transport, detail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      produkt,
      kategori,
      co2e_pr_kg,
      landbrug,
      iluc,
      forarbejdning,
      emballage,
      transport,
      detail,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Food added`);
    }
  );
};

//route for /populateFoods
const populateFoods = (request, response) => {
  const fooddata = "food_data.csv";
  const options = {
    delimiter: ";",
  };

  csvtojson()
    .fromFile(fooddata, options)
    .then((source) => {
      //Fetching the data from each row
      //and inserting to the table food_tmp
      for (var i = 0; i < source.length; i++) {
        var produkt = source[i]["Produkt"];
        var kategori = source[i]["Kategori"];
        var co2e_pr_kg = source[i]["Total kg CO2e/kg"];
        var landbrug = source[i]["Landbrug"];
        var iluc = source[i]["ILUC"];
        var forarbejdning = source[i]["Forarbejdning"];
        var emballage = source[i]["Emballage"];
        var transport = source[i]["Transport"];
        var detail = source[i]["Detail"];

        var insertStatement = `INSERT INTO food_tmp(produkt, kategori, co2e_pr_kg, landbrug, "ILUC", forarbejdning, emballage, transport, detail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        var items = [
          produkt,
          kategori,
          co2e_pr_kg,
          landbrug,
          iluc,
          forarbejdning,
          emballage,
          transport,
          detail,
        ];

        //Inserting data of current row into database
        pool.query(insertStatement, items, (err, results, fields) => {
          if (err) {
            console.log("Unable to insert item at row " + i + 1);
            return console.log(err);
          }
        });
      }
      response.status(201).send("All foods added");
    });
};

module.exports = {
  getFoods,
  insertFood,
  populateFoods,
  fetchCategoryData,
};
