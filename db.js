const mongoose = require("mongoose");

const connectToDatabase = (uri) =>
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

module.exports = connectToDatabase;
