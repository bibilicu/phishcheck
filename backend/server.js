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

// port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening to ${PORT}...`));
