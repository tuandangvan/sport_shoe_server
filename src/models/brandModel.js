import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
      unique: true,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    origin: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "Active"
    }
  },
  {
    collection: "brands",
    timestamps: true
  }
);

const brand = mongoose.model("Brand", brandSchema);
export default brand;
