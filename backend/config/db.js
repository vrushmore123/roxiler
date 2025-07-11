const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "your_database_name",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

module.exports = connection;
