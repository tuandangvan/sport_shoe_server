import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      required: true,
      default: "Active"
    }
  },
  {
    collection: "categories",
    timestamps: true
  }
);

const category = mongoose.model("Category", categorySchema);
export default category;
