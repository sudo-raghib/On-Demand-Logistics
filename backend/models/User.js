const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "driver", "admin"],
    default: "user",
  },
});

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// Password verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", userSchema);

module.exports = User;
