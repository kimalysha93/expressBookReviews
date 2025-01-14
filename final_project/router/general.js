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
  // Send JSON response with formatted book data
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the isbn parameter from the request URL and send corresponding book details
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Retrieve the author parameter from the request URL and send corresponding book details
  const author = JSON.parse(req.params.author);

  let matching_books = {};

  let keys = Object.keys(books);

  for (const key of keys) {
    if (books[key].author == author) {
      matching_books[key] = books[key];
    }
  }

  res.send(matching_books);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Retrieve the title parameter from the request URL and send corresponding book details
  const title = JSON.parse(req.params.title);

  let matching_books = {};

  let keys = Object.keys(books);

  for (const key of keys) {
    if (books[key].title == title) {
      matching_books[key] = books[key];
    }
  }

  res.send(matching_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Retrieve the isbn parameter from the request URL and send corresponding book review
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
