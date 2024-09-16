const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin } = require("../db");
const { Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRETE } = require("../config");

router.post("/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = req.body.status;
    const userExists = await Admin.findOne({ username: username });
    if (userExists) {
      res.status(409).json({
        message: "username already taken",
      });
    } else {
      await Admin.create({
        username: username,
        password: password,
        isAdmin: isAdmin,
      });
      res.status(201).json({
        message: "admin created succesfully",
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
    const adminExists = await Admin.findOne({
      username: username,
      password: password,
    });

    if (!adminExists) {
      return res.status(401).json({
        message: "invalid username or password",
      });
    } else {
      const adminStatus = adminExists.isAdmin;
      const token = jwt.sign(
        { username: username, isAdmin: adminStatus },
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

router.post("/courses", adminMiddleware, async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    const courseData = {
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
    };
    const courseCreate = await Course.create(courseData);
    res.status(201).json({
      message: "course created succesfully",
      courseId: courseCreate._id,
    });
  } catch (e) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
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

module.exports = router;
