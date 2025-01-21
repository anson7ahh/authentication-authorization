const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const register = async (req, res, next) => {
  try {
    const { fullName, password, email, phoneNumber } = req.body;
    console.log(fullName, password, email, phoneNumber);
    const findAccount = await user.findOne({ phoneNumber: phoneNumber });
    if (!findAccount) {
      const newUser = await user.create({
        fullName: fullName,
        password: bcrypt.hashSync(password, 10),
        email: email,
        phoneNumber: phoneNumber,
      });
      return res.json(
        {
          message: "User created successfully",
        },
        201
      );
    }
    return res.json(
      {
        message: "account had already!!",
      },
      409
    );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const account = await user.findOne({ email: email });
    if (!account) {
      return res.status(404).json({
        message: "No such account found",
      });
    }
    const comparePassword = await bcrypt.compare(password, account.password);
    if (!comparePassword) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }

    const payload = {
      id: account.id,
    };
    const accessToken = await jwt.sign(
      {
        payload,
      },
      process.env.PRIVATE_KEY,
      { expiresIn: process.env.JWT_TIME }
    );
    if (!accessToken) {
      throw new Error();
    }

    return res.status(200).json({
      message: "success",
      token: accessToken,
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
    });
  } catch (err) {
    next(err);
  }
};
const editUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const { fullName, email, phoneNumber } = req.body;
    if (!authHeader) {
      return res.status(400).json({ message: "Token is missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Invalid token format" });
    }

    const userId = await jwt.verify(token, process.env.PRIVATE_KEY);
    console.log("Verified User ID:", userId.payload.id);
    const account = await user.findOne({
      _id: new ObjectId(userId.payload.id),
    });
    const updatedUser = await user.findOneAndUpdate(
      account,
      { $set: { fullName, email, phoneNumber } },
      { new: true }
    );
    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
const editPassword = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: "Token is missing" });
    }
    const token = authHeader.split(" ")[1];
    console.log("token ", token);
    if (!token) {
      return res.status(400).json({ message: "Invalid token format" });
    }
    console.log("Token extracted:", token);
    const userId = await jwt.verify(token, process.env.PRIVATE_KEY);
    console.log("Verified User ID:", userId.payload.id);
    const { currentPassword, confirmPassword, newPassword } = req.body;
    console.log("Request Body Data:", {
      currentPassword,
      confirmPassword,
      newPassword,
    });
    const account = await user.findOne({
      _id: new ObjectId(userId.payload.id),
    });
    if (!account) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    const comparePassword = await bcrypt.compare(
      currentPassword,
      account.password
    );
    if (!comparePassword) {
      return res.status(403).json({
        message: "Current password is incorrect",
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedNewPassword;
    await account.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in editPassword:", error.message, error.stack);

    return res.status(500).json({
      message: "Internal Server Error: Unable to process the request",
    });
  }
};

module.exports = {
  register,
  loginUser,
  editUser,
  editPassword,
};
