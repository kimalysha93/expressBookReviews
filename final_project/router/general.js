const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

// register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // check if both username and password are provided
  if (username && password) {
    // check if the user does not already exist
    if (!doesExist(username)) {
      // Add new user to the users array
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

async function getBooks() {
  return JSON.stringify(books, null, 4);
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Send JSON response with formatted book data
  getBooks().then(function (value) {
    res.send(value);
  });
});

async function getBooksByISBN(isbn) {
  return books[isbn];
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the isbn parameter from the request URL and send corresponding book details
  const isbn = req.params.isbn;
  getBooksByISBN(isbn).then(function (value) {
    res.send(value);
  });
});

async function getBooksByAuthor(author) {
  let matching_books = {};

  let keys = Object.keys(books);

  for (const key of keys) {
    if (books[key].author == author) {
      matching_books[key] = books[key];
    }
  }

  return matching_books;
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Retrieve the author parameter from the request URL and send corresponding book details
  const author = JSON.parse(req.params.author);

  getBooksByAuthor(author).then(function (value) {
    res.send(value);
  });
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
