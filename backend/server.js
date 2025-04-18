const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // to keep sensitive credentials out of source code
//and loading environment variables
const morgan = require("morgan"); // to log incoming requests, response statuses in std format
const dbConnect = require("./config/db");
const routes = require("./routes/appRoutes");

// dotenv
dotenv.config();

// database
dbConnect();

// REST
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);

// const generateMailTransporter = () => {
//   // What does the following output?
//   console.log("Email:", process.env.SMTP_USER);
//   console.log("Email Pass:", process.env.SMTP_PASS);
// };

// generateMailTransporter();

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening to ${PORT}...`));
