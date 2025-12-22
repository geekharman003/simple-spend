const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("name,email and password are required");
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      // Store hash in your password DB.
      const user = await User.create({
        name,
        email,
        password: hash,
      });

      if (!user) {
        throw new Error("error occur during creating account");
      }

      res.status(201).send("User Created Successfully");
    });
  } catch (error) {
    if (error.message === "Validation error") {
      return res.status(409).send("User already exists");
    }

    res.status(500).send(error.message);
  }
};

const generateAccessToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, "secretkey");
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }

    const user = await User.findOne({
      where: {
        email,
      },
      raw: true,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        // res.send("User login successful");
        const token = generateAccessToken(user.id, user.name, user.email);
        res.status(200).json({ redirect: true, token });
      } else {
        return res.status(409).send("Password is not correct");
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createUser, loginUser };
