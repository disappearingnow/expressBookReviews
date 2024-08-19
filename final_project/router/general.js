const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(404)
      .json({ error: "Username and password are required" });
  }

  const isUsernameAvailable = isValid(username);
  if (!isUsernameAvailable) {
    return res.status(404).json({ error: "Username is already taken" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({
    message: `User ${username} has been registered successfully`,
    users,
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const getBooksPromise = new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (err) {
      reject(err);
    }
  });

  getBooksPromise
    .then((promiseResponse) => {
      return res.status(200).json({ allBooks: promiseResponse });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  const getIsbnPromise = new Promise((resolve, reject) => {
    try {
      if (typeof books[isbn] === "undefined") {
        reject(`No book with ISBN ${isbn} found`);
      }
      resolve(books[isbn]);
    } catch (err) {
      reject(err);
    }
  });

  getIsbnPromise
    .then((promiseResponse) => {
      return res
        .status(200)
        .json({ searchResults: { ...promiseResponse, isbn } });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const getByAuthorPromise = new Promise((resolve, reject) => {
    try {
      const bookList = [];

      for (const i in books) {
        if (books[i].author === author) bookList.push(books[i]);
      }
      if (bookList.length === 0) {
        reject(`No books written by ${author} found`);
      }
      resolve(bookList);
    } catch (err) {
      reject(err);
    }
  });

  getByAuthorPromise
    .then((promiseResponse) => {
      res.status(200).json({ searchResults: promiseResponse });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const getByTitlePromise = new Promise((resolve, reject) => {
    try {
      const bookList = [];

      for (const i in books) {
        if (books[i].title === title) bookList.push(books[i]);
      }

      if (bookList.length === 0) {
        reject(`No books with the title '${title}' found`);
      }
      resolve(bookList);
    } catch (err) {
      reject(err);
    }
  });

  getByTitlePromise
    .then((promiseResponse) => {
      return res.status(200).json({ searchResults: promiseResponse });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (typeof books[isbn] === "undefined") {
    return res.status(404).json({ error: "Invalid ISBN" });
  }

  return res.status(200).json({
    reviews: books[isbn].reviews,
  });
});

module.exports.general = public_users;
