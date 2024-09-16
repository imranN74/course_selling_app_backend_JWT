const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User } = require("../db");
const { Course } = require("../db");
const { PurchasedCourses } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRETE } = require("../config");

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = req.body.status;
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      res.status(409).json({
        message: "username already taken",
      });
    } else {
      await User.create({
        username: username,
        password: password,
        isAdmin: isAdmin,
      });
      res.status(201).json({
        message: "user created succesfully",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await User.findOne({
      username: username,
      password: password,
    });

    if (!userExists) {
      return res.status(401).json({
        message: "invalid username or password",
      });
    } else {
      const userStatus = userExists.isAdmin;
      const token = jwt.sign(
        { username: username, isAdmin: userStatus },
        JWT_SECRETE
      );
      res.status(200).json({
        yourToken: token,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const allCourses = await Course.find();
    res.status(200).json({
      courses: allCourses,
    });
  } catch (e) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  try {
    const courseToPurchase = req.params.courseId;
    const username = req.username;
    const userId = await User.findOne({ username: username });
    const purchseCoursedata = {
      userId: userId._id,
      courseId: courseToPurchase,
    };
    await PurchasedCourses.create(purchseCoursedata);
    res.status(201).json({
      message: "course purchased succesfully",
    });
  } catch (e) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  try {
    const username = req.username;
    const userId = await User.findOne({ username: username });
    const purchasedCourseId = await PurchasedCourses.find({
      userId: userId._id,
    });
    const purchasedCoursesList = await Course.find({
      _id: { $in: purchasedCourseId.map((courses) => courses.courseId) },
    });
    res.status(200).json({
      purchasedCoursesByUser: purchasedCoursesList,
    });
  } catch (e) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

module.exports = router;
