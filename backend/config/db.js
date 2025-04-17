// database
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to database: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
  }
};

module.exports = dbConnect;
