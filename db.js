const mongoose = require("mongoose");

const connectToDatabase = () => mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connectToDatabase;