import mysql from "mysql2";

export const db = mysql.createConnection({
  host: process.env.MYSQL_CREATE_CONNECTION_HOST,
  user: process.env.MYSQL_CREATE_CONNECTION_USER,
  password: process.env.MYSQL_CREATE_CONNECTION_PASSWORD,
  database: process.env.MYSQL_CREATE_CONNECTION_DATABASE,
});
