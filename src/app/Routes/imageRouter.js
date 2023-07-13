const express = require("express");
const imageRouter = express.Router();
const ImageController = require("../Controllers/imageController");
const Middleware = require("../Middleware/middleware");

// POST - UPLOAD IMAGE
imageRouter.post("/upload/:id", Middleware.auth, Middleware.defineUser, ImageController.upload);

// GET - GET IMAGE BY ID
imageRouter.get("/:id", ImageController.getImageById);

// GET - GET ALL IMAGE
imageRouter.get("/", ImageController.getAllImage);

// DELETE - DELETE IMAGE - NO TEST
imageRouter.delete("/delete/:id", Middleware.auth, Middleware.defineUser, ImageController.deleteImage);

module.exports = imageRouter