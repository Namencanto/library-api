import { db } from "../db.js";
import { verifyTokenAndUserType } from "./verifyTokenAndUserType.js";

// ALL USER TYPE ACTIONS
// Get all books
export const allBooks = (req, res) => {
  verifyTokenAndUserType(req, res, () => {
    try {
      const qGetAllBooks = "SELECT * FROM `books`";
      db.query(qGetAllBooks, (err, data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  });
};

// Get books available for lending
export const allAvailableBooks = (req, res) => {
  verifyTokenAndUserType(req, res, () => {
    try {
      const qGetAllBooks = "SELECT * FROM `books` WHERE `borrowed_by` = 0 ";
      db.query(qGetAllBooks, (err, data) => {
        return res.status(200).json(data);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  });
};

// ADMIN ACTIONS
// Add new book
export const addNewBook = (req, res) => {
  verifyTokenAndUserType(req, res, (userInfo) => {
    if (!userInfo.admin)
      return res.status(400).json("Users are not allowed to add new books");

    const { name, author, isbn } = req.body;
    const qCheckBookExist = "SELECT id FROM books WHERE isbn = ? OR name = ?";

    db.query(qCheckBookExist, [isbn, name], (err, data) => {
      if (err) return res.status(500).send(err);

      if (data.length > 0)
        return res.status(400).json("This book already exists");

      const qAddNewBook =
        "INSERT INTO books(`name`,`author`,`isbn`, `borrowed_by`) VALUES (?,?,?, 0)";
      console.log(name, author, isbn);
      db.query(qAddNewBook, [name, author, isbn], (err, data) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json("Successfully added a new book");
      });
    });
  });
};

// Delete a book
export const deleteBook = (req, res) => {
  verifyTokenAndUserType(req, res, (userInfo) => {
    if (!userInfo.admin)
      return res.status(400).json("Users are not allowed to delete books");

    const bookId = req.params.id;

    const qDeleteBook = "DELETE FROM books WHERE id = ?";

    db.query(qDeleteBook, [bookId], (err, data) => {
      if (err) return res.status(500).send(err);

      if (data.affectedRows === 0) {
        return res.status(404).json("Book not found");
      }

      return res.status(200).json("Successfully deleted book");
    });
  });
};

// Edit a book
export const editBook = (req, res) => {
  verifyTokenAndUserType(req, res, (userInfo) => {
    if (!userInfo.admin) {
      return res.status(400).json("Users are not allowed to edit books");
    }

    const bookId = req.params.id;
    const { name, author, isbn, borrowed_by } = req.body;

    // Check if the book exists
    const qCheckBook = "SELECT * FROM books WHERE id = ?";
    db.query(qCheckBook, [bookId], (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.length === 0) return res.status(404).json("Book not found");

      const existingBook = data[0];

      // Update the book with the new values
      const updatedBook = {
        name: name || existingBook.name,
        author: author || existingBook.author,
        isbn: isbn || existingBook.isbn,
        borrowed_by: borrowed_by || existingBook.borrowed_by,
      };

      const qUpdateBook =
        "UPDATE books SET name = ?, author = ?, isbn = ?, borrowed_by = ? WHERE id = ?";
      const values = [
        updatedBook.name,
        updatedBook.author,
        updatedBook.isbn,
        updatedBook.borrowed_by,
        bookId,
      ];

      db.query(qUpdateBook, values, (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json("Book has been updated");
      });
    });
  });
};

// USER ACTIONS
// Borrow a new book
export const borrowBook = (req, res) => {
  verifyTokenAndUserType(req, res, (userInfo) => {
    if (userInfo.admin) {
      return res.status(400).json("Admins are not allowed to borrow books");
    }

    const bookId = req.params.id;

    // Check if the book exists and is available
    const qCheckBook = "SELECT id, borrowed_by FROM books WHERE id = ?";
    db.query(qCheckBook, [bookId], (err, data) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (data.length === 0) {
        return res.status(404).json("The book has not been found");
      }

      if (data[0].borrowed_by !== 0) {
        if (data[0].borrowed_by === userInfo.id) {
          return res.status(409).json("You have already borrowed this book");
        } else {
          return res
            .status(409)
            .json("This book is currently borrowed by someone else");
        }
      }

      // Update the book
      const qUpdateBook = "UPDATE books SET borrowed_by = ? WHERE id = ?";
      db.query(qUpdateBook, [userInfo.id, bookId], (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.status(200).json("This book is now borrowed by you");
      });
    });
  });
};

// Return previously borrowed book
export const returnBorrowedBook = (req, res) => {
  verifyTokenAndUserType(req, res, (userInfo) => {
    if (userInfo.admin)
      return res.status(400).json("Admins are not allowed to return books");

    const bookId = req.params.id;

    // Check if the book exists
    const qCheckBook = "SELECT id FROM books WHERE id = ? AND borrowed_by = ?";
    db.query(qCheckBook, [bookId, userInfo.id], (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.length === 0)
        return res.status(404).json("Book not found or not borrowed by you");

      // Set the book is not borrowed by anyone
      const qReturnBook = "UPDATE books SET borrowed_by = 0 WHERE id = ?";

      db.query(qReturnBook, [bookId], (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json("The book has been returned");
      });
    });
  });
};
