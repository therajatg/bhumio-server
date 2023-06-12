const express = require("express");
require("dotenv").config();
const pool = require("./db/db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const dataGrid = await pool.query("SELECT * FROM inventory ORDER BY id ASC");
  res.status(200).json(dataGrid.rows);
});

app.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM inventory WHERE id = $1", [req.params.id]);
    const newDataGrid = await pool.query(
      "SELECT * FROM inventory ORDER BY id ASC"
    );
    res.status(200).json(newDataGrid.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/", async (req, res) => {
  try {
    req.body.updatedRows.forEach(async (row) => {
      await pool.query(
        'UPDATE inventory SET "LOCATION A STOCK" = $1 WHERE id = $2',
        [row["LOCATION A STOCK"], row.id]
      );
    });
    const response = await pool.query(
      `SELECT * FROM inventory ORDER BY id ASC`
    );
    res.status(200).json(response.rows);
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
