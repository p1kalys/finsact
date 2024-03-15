const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User, Account } = require("../db");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signInBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  console.log("Success");
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signInBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    return res.status(200).json({
      token,
    });
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

router.put("/update", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (success) {
    await User.updateOne(req.body, {
      id: req.userId,
    });
    res.status(200).json({
      message: "Updated successfully",
    });
  } else {
    res.status(411).json({
      message: "Error while updating the information",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filtered = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filtered,
        },
      },
      {
        lastName: {
          $regex: filtered,
        },
      },
    ],
  });

  if (users) {
    res.json({
      user: users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        id: user._id,
      })),
    });
  }
});

module.exports = router;
