const { mongoose, model } = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => console.log("Connected!"));
const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const user = model("users", UserSchema);
module.exports = user;
