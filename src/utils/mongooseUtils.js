const multipleMongooseToObject = (mongooseArr) => {
  return mongooseArr.map((arr) => arr.toObject());
};
const mongooseToObject = (mongoose) => {
  return mongoose ? mongoose.toObject() : mongoose;
};
export const mongooseUtils = {
  multipleMongooseToObject,
  mongooseToObject,
};
