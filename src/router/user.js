const router = require("express").Router();

const {
  register,
  loginUser,
  editUser,
  editPassword,
} = require("../controller/user.js");
const validateRegister = require("../middlleware/validateRegister.js");

router.post("/signup", validateRegister, register);
router.post("/signin", loginUser);
router.patch("/edit", editUser);
router.patch("/edit-password", editPassword);
module.exports = router;
