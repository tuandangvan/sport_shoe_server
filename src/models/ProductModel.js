import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    ],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    categoryName: {
      type: String,
      required: true
    },
    brandName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    collection: "products",
    timestamps: true
  }
);

const product = mongoose.model("Product", productSchema);
export default product;
