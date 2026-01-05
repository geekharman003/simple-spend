const json = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = json.verify(token, "secretkey");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = { authenticateUser };
