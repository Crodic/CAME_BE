const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    title: { type: String, default: "New Collection", min: 1, max: 100, trim: true },
    images: [{ type: mongoose.Types.ObjectId, ref: "images" }],
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    view: { type: Number, min: 0, default: 0 },
    like: [{ type: mongoose.Types.ObjectId, ref: "users" }],
    tag: [{ type: String, min: 1, max: 20, default: "all" }],
    type: { type: String, enum: ["private", "public"], default: "public" },
    category: { type: mongoose.Types.ObjectId, ref: "categories" },
}, { timestamps: true })

const CollectionModel = mongoose.model("collections", CollectionSchema);

module.exports = CollectionModel;