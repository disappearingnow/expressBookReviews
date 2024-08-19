const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.filter((user) => user.username === username).length === 0;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is missing" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ message: `User ${username} is now logged in` });
  } else {
    return res
      .status(400)
      .json({ message: "Username and password do not match any records" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res
      .status(400)
      .json({ message: `Book with ISBN ${isbn} does not exist` });
  }

  const { username } = req.session.authorization;
  const { review } = req.body;

  const keys = Object.keys(books[isbn].reviews);
  const doesReviewExist =
    typeof keys.find((usernameKey) => usernameKey === username) !== "undefined";
  const responseMsg = `Review for book ${
    books[isbn].title
  } by user ${username} has been ${doesReviewExist ? "updated" : "added"}`;

  books[isbn].reviews[username] = review;

  console.log(books[isbn].reviews);

  return res.status(200).json({ message: responseMsg, reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
