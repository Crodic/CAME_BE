const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId },
    title: { type: String, min: 10, max: 50, required: true, trim: true },
    description: { type: String, min: 20, max: 255, trim: true },
    problem: [{ type: String, enum: ["Spam", "Scam", "Wrong Category", "Cheat", "More"], default: "More" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    other: { type: mongoose.Types.ObjectId, ref: "user", required: true }
}, { timestamps: true })

const ReportModel = mongoose.model("reports", ReportSchema);

module.exports = ReportModel;