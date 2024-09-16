const mongoose = require("mongoose");
const { DB_CONNECTION_URL } = require("../config");

// Connect to MongoDB
mongoose.connect(DB_CONNECTION_URL);

const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
  isAdmin: Boolean,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
});

const PurchasedCoursesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);
const PurchasedCourses = mongoose.model(
  "PurchasedCourses",
  PurchasedCoursesSchema
);

module.exports = {
  Admin,
  User,
  Course,
  PurchasedCourses,
};
