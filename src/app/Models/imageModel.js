const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    name: { type: String, default: "New Image", max: 255, min: 1, trim: true },
    url: { type: String, max: 255, min: 5, required: true, unique: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    collections: [{ type: mongoose.Types.ObjectId, ref: "collections" }],
    like: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    view: { type: Number, default: 0, min: 0 },
    comment: [{ type: mongoose.Types.ObjectId, ref: "comments" }],
    type: { type: String, enum: ['private', "public"], default: "public", trim: true },
    category: { type: mongoose.Types.ObjectId, ref: "categories" },
}, { timestamps: true })

const ImageModel = mongoose.model("images", ImageSchema);

module.exports = ImageModel;