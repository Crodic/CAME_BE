const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, min: 1, required: true },
    like: { type: Number, min: 0, default: 0 },
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    collection: { type: mongoose.Types.ObjectId, ref: "collections" },
    image: { type: mongoose.Types.ObjectId, ref: "images" },
}, { timestamps: true })

const CommentModel = mongoose.model("comments", CommentSchema);
module.exports = CommentModel;