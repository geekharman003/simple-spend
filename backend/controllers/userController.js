const User = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("name,email and password are required");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      throw new Error("error occur during creating account");
    }

    res.status(201).send("User Created Successfully");
  } catch (error) {
    if (error.message === "Validation error") {
      return res.status(409).send("User already exists");
    }

    res.status(500).send(error.message);
  }
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

    if (password !== user.password) {
      return res.status(401).send("User not authorized");
    }

    res.status(200).send("User login successful");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createUser, loginUser };
