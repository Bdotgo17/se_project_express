const mongoose = require("mongoose");

function connectToDatabase(uri = process.env.MONGODB_URI) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectToDatabase;