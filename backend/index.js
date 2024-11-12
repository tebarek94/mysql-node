import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mysql-node", // Ensure your database name is correct
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// Create table endpoint (can be run once to set up the table)
app.get("/create", (req, res) => {
  const sqlC = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      PRIMARY KEY (id)
    );
  `;

  db.query(sqlC, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating table");
    } else {
      res.send("Table created successfully");
    }
  });
});

// Insert data endpoint
app.post("/insertdata", (req, res) => {
  const { name, email } = req.body;

  // Query to insert user data
  const insertData = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.query(insertData, [name, email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error inserting data");
    }

    console.log("Data inserted:", result);
    res.send("Registration successful!");
  });
});

app.get("/list", (req, res) => {
  let sql = `select * from users`;
  db.query(sql, (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
