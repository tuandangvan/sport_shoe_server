import mongoose from "mongoose";
<<<<<<< HEAD

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
    }
  },
  {
    timestamps: true
  }
);

const sizeSchema = mongoose.Schema(
  {
    size: {
      type: Number,
      required: true
    },
    countInStock: {
      type: Number,
      require: true,
      default: 0
    }
  }
);

const colorSchema = mongoose.Schema(
  {
    color: {
      type: String,
      required: true
    },
    sizes: [sizeSchema]
  }
);

=======
>>>>>>> f2ba31572932e6a62b7a76b346b5002173509865
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
    },
    colors: [colorSchema]
  },
  {
    collection: "products",
    timestamps: true
  }
);

const product = mongoose.model("Product", productSchema);
export default product;
