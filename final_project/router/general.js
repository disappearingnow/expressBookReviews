const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (!books[isbn]) {
    res.send("Invalid ISBN");
    return;
  }

  res.send(JSON.stringify(books[isbn]));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const bookList = [];

  for (const i in books) {
    if (books[i].author === author) bookList.push(books[i]);
  }

  if (bookList.length === 0) {
    res.send(`No books written by ${author} found`);
  } else {
    res.send(JSON.stringify(bookList));
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const bookList = [];

  for (const i in books) {
    if (books[i].title === title) bookList.push(books[i]);
  }

  if (bookList.length === 0) {
    res.send(`No books with the title "${title}" found`);
  } else {
    res.send(JSON.stringify(bookList));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {

});

module.exports.general = public_users;
