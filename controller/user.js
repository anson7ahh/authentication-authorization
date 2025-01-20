const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      return res.json(
        {
          message: "No such account found",
        },
        404
      );
    }
    const comparePassword = await bcrypt.compare(password, account.password);
    if (!comparePassword) {
      return res.json(
        {
          message: "Password is incorrect",
        },
        401
      );
    }
    const payload = {
      id: user.id,
    };
    const accessToken = await jwt.sign(
      {
        payload,
      },
      process.env.privateKey,
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
    const id = await jwt.verify(req.headers.token);
    const { fullName, email, phoneNumber } = req.body.data;
    const account = await user.findOne({ id: id });
    if (!account) {
      return res.json(
        {
          message: "unAuthorization",
        },
        403
      );
    }
    await userToUpdate.update({
      fullName: account.fullName,
      email: account.email,
      phoneNumber: account.phoneNumber,
    });
  } catch (error) {
    next(err);
  }
};
const editPassword = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization;
    if (!authHeader) {
      return res.json({ message: "Token is missing" }, 400);
    }
    console.log("Authorization header:", AuthHeader);

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "Invalid token format" });
    }
    console.log("Token extracted:", token);

    const id = await jwt.verify(token, process.env.privateKey);
    console.log("Verified User ID:", id);

    const { currentPassword, confirmPassword, newPassword } = req.body.data;
    console.log("Request Body Data:", {
      currentPassword,
      confirmPassword,
      newPassword,
    });
    const account = await user.findOne({ id: id });
    if (!account) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    console.log("Account found:", account);
    if (currentPassword !== account.password) {
      return res.status(403).json({
        message: "Forbidden: Current password is incorrect",
      });
    }

    account.password = newPassword;
    await account.save();
    console.log("Password updated successfully for user:", id);

    // Bước 9: Phản hồi thành công
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    // In lỗi chi tiết
    console.error("Error in editPassword:", error.message, error.stack);

    // Trả về lỗi nội bộ
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
