const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const gameUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

gameUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

gameUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const GameUser = mongoose.models.GameUser || mongoose.model("GameUser", gameUserSchema, "gameusers");

module.exports = GameUser;
