const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VipSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    vip: { type: Number, min: 0, max: 12, default: 0 },
    exp: { type: Number, min: 0, max: 12000, default: 0 },
    updateAt: { type: Date, default: Date.now }
})

const VipModel = mongoose.model("vips", VipSchema);
module.exports = VipModel;

