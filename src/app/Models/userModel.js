const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, min: 6, max: 26, trim: true },
    password: { type: String, required: true, unique: true, min: 8, trim: true },
    name: { type: String, required: true, min: 1, max: 100, trim: true },
    role: { type: String, default: "user", enum: ["admin", "user"], trim: true },
    age: { type: Number, max: 80, default: 0 },
    avatar: { type: String, max: 255, default: `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/v1689042176/Avatar/avatar_default_blhmhb.png` },
    phone: { type: String, min: 2, max: 20, unique: true },
    email: { type: String, max: 100, unique: true, trim: true },
    collections: [{ type: mongoose.Types.ObjectId, ref: "collections" }],
    images: [{ type: mongoose.Types.ObjectId, ref: "images" }],
    follower: [{ type: mongoose.Types.ObjectId }],
    following: [{ type: mongoose.Types.ObjectId }],
    category: [{ type: mongoose.Types.ObjectId, ref: "categories" }],
}, {
    timestamps: true
})

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;