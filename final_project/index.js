const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { users } = require("./router/auth_users.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  // check if user is logged in and has valid access token
  if (req.session.authenticated) {
    let token = req.session.authenticated["accessToken"];

    // Verify JWT token
    jwt.verify(token, "access", (err, users) => {
      if (!err) {
        req.users = users;
        next();
      } else {
        return res.status(403).json({ message: "Customer not authorized" });
      }
    });
  } else {
    return res.status(403).json({ message: "Customer not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
