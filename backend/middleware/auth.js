const json = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = json.verify(token, "secretkey");
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { authenticateUser };
