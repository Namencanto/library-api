import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";

const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
