import express from "express";
import {
  allBooks,
  allAvailableBooks,
  addNewBook,
  editBook,
  deleteBook,
  borrowBook,
  returnBorrowedBook,
} from "../controllers/book.js";

const router = express.Router();

router.get("/", allBooks);
router.get("/available", allAvailableBooks);
router.post("/", addNewBook);
router.put("/:id", editBook);
router.delete("/:id", deleteBook);
router.post("/:id/borrow", borrowBook);
router.post("/:id/return", returnBorrowedBook);

export default router;
