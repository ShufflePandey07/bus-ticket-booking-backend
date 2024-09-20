// Importing required packages
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormdata = require("express-fileupload");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("dev"));

// Configure form data handling
app.use(acceptFormdata());

// Connect to database
connectDatabase();

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

module.exports = app;
