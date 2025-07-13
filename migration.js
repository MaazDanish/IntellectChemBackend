import mysql from 'mysql2';
import migration from 'mysql-migrations';
import dotenv from 'dotenv';
dotenv.config();


var connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

migration.init(connection, __dirname + "/src/migrations", function () {
  console.log("finished running migrations");
});
