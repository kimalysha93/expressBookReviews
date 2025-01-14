const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    req.session.authenticated = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("ISBN: " + req.params.isbn);
  console.log("Session Username: " + req.session.authenticated.username);
  console.log("Review: " + req.params.review);

  const isbn = req.params.isbn;
  const username = req.session.authenticated.username;

  if (req.params.isbn) {
    // Create review based on provided isbn
    books[isbn].reviews[username] = {
      //username: req.session.authenticated.username,
      review: req.params.review,
    };
    console.log(books[isbn]);
  }

  res.send(
    username + " has added/updated a review for the book with ISBN " + isbn
  );

  /*
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  */
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
