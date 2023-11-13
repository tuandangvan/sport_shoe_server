import mongoose, { Schema } from "mongoose";

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
        _id: {
          type: Schema.Types.ObjectId,
          auto: false
        },
        reviewId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Review"
        }
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
      type: Number
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
    },
    typeProduct: [
      {
        size: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    sold:{
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    collection: "products",
    timestamps: true
  }
);

const product = mongoose.model("Product", productSchema);
export default product;
