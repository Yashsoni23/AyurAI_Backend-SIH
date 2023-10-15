const User = require("../models/user.js");
const dotenv = require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSecret;

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.json({
        success: true,
        data: "No users available in db",
      });
    } else {
      res.json({
        success: true,
        data: users,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      data: [],
      error: "Something went wrong in all users get request",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "Email and password cannot be null.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        data: [],
        error: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        data: [],
        error: "Incorrect password.",
      });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
      expiresIn: "7 days", // Token expiration set to 7 days
    });

    res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong in the login user post request",
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "Email and password cannot be null.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: [],
        error: "Email is already in use.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email,
      password: hashPassword,
    });
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
      expiresIn: "7 days", // Token expiration set to 7 days
    });

    res.status(201).json({
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong in signup user post request",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    if (_id == ":id") {
      res.status(404).json({
        success: false,
        data: [],
        error: "Id cannot be null.",
      });
    } else {
      const user = await User.findOne({ _id }).populate("PHR");

      if (!user) {
        return res.status(404).json({
          success: false,
          data: [],
          error: "User not found.",
        });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      data: [],
      error: "Something went wrong in getting single user get request",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/:id/toggle-verification", async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId == ":id") {
      res.status(404).json({
        success: false,
        data: [],
        error: "Id cannot be null.",
      });
    } else {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found.",
        });
      }

      user.isVerified = !user.isVerified;
      await user.save();

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while toggling verification.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    if (userId === ":id") {
      res.status(404).json({
        success: false,
        data: [],
        error: "Id cannot be null.",
      });
    } else {
      const deletedUser = await User.findByIdAndRemove(userId);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: deletedUser,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    const users = await User.deleteMany(); // Deletes all users

    res.status(200).json({
      success: true,
      data: "All users have been deleted " + users,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

module.exports = router;
