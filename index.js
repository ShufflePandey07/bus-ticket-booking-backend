// module.exports = app;

const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Configure CORS
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());

// Connect to database
connectDatabase();

// Define routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/bus", require("./routes/busRoutes"));

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

module.exports = app;
