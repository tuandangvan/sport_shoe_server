const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      required: false,
      unique: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);
//
// * Using normal function in case of catching API, DO NOT USE Arrow Function.
userSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

module.exports = User;
