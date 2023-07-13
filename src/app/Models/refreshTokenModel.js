const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    refresh_token: { type: String, min: 0, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
})

const refreshTokenModel = mongoose.model("tokens", refreshTokenSchema);

module.exports = refreshTokenModel;