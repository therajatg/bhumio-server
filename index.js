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
  const { updatedRows } = req.body;
  try {
    for (let i = 0; i < updatedRows?.length; i++) {
      if (updatedRows[i]["LOCATION A STOCK"] >= 0) {
        await pool.query(
          'UPDATE inventory SET "LOCATION A STOCK" = $1 WHERE id = $2',
          [updatedRows[i]["LOCATION A STOCK"], updatedRows[i].id]
        );
      } else if (updatedRows[i]["LOC B STOCK"] >= 0) {
        await pool.query(
          'UPDATE inventory SET "LOC B STOCK" = $1 WHERE id = $2',
          [updatedRows[i]["LOC B STOCK"], updatedRows[i].id]
        );
      }
    }
    const response = await pool.query(
      `SELECT * FROM inventory ORDER BY id ASC`
    );
    res.status(200).json(response.rows);
  } catch (error) {
    console.log(error);
  }
});

app.listen(8080, () => console.log("Server started on port 5000"));
// req.body.updatedRows.forEach(async (row) => {
//   await pool.query(
//     'UPDATE inventory SET "LOCATION A STOCK" = $1, "LOC B STOCK" = $2 WHERE id = $3',
//     [row["LOCATION A STOCK"], row["LOC B STOCK"], row.id]
//   );
// });
