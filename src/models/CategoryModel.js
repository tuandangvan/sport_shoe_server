import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const category = mongoose.model("Category", categorySchema);
export default category;
