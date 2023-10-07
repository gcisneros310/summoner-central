const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const apiRoutes = require("./routes/apiRoutes"); // Import the API routes

const mongoose = require("mongoose");
const host = "0.0.0.0";

const app = express();

app.use(bodyParser.json({ limit: '20mb' })); // Adjust the limit as needed
app.use("/api/user", userRoutes); // Use the user routes
app.use('/api', apiRoutes) // Use the API routes

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, host, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
