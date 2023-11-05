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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  },
  {
    timestamps: true
  }
);

const category = mongoose.model("Category", categorySchema);
export default category;
