const mongoose = require("mongoose");

const connectToDatabase = (uri) =>
   mongoose.connect(uri) // Return the promise directly
;

module.exports = connectToDatabase;