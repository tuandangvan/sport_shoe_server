module.exports = {
  multipleMongooseToObject: (mongooseArr) => {
    return mongooseArr.map((arr) => arr.toObject());
  },
  mongooseToObject: (mongoose) => {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
