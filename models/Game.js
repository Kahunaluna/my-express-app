const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameName: {type: String, required: true, trim: true,},
    ranking: {type: Number, required: true, min: 1, max: 10,}
  },
    { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
