import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import findOrCreate from "mongoose-findorcreate";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false,
      unique: false
    },
    address: {
      type: String,
      required: false,
      unique: false,
      default: ""
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: false,
      default: ""
    },
    password: {
      type: String,
      required: false,
      unique: false
    },
    avatarUrl: {
      type: String,
      required: false,
      unique: false,
      default: ""
    },
    codeConfirmMail: {
      type: String,
      required: false
    },
    expiredCodeConfirmMail: {
      type: Date,
      required: false
    },
    gender: {
      type: String,
      default: "Others"
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    googleId: { type: Number, required: false },
    status: {
      type: String,
      required: true,
      default: "Active"
    }
  },
  {
    collection: "users",
    timestamps: true
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
const user = mongoose.model("User", userSchema);
export default user;
