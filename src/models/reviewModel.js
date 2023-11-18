import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    comment: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      default: "Active"
    }
  },
  {
    collection: "reviews",
    timestamps: true
  }
);
const review = mongoose.model("Review", reviewsSchema);
export default review;
