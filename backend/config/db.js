const mongoose = require("mongoose");


const connectionUrl=process.env.DB_URL||"mongodb://localhost:27017"
const connectDB = async () => {
  try {
    await mongoose.connect(`${connectionUrl}/logistics`, {
      authSource: 'admin', 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
