const express = require("express");
const Middleware = require("../../Middleware/v2/v2_middleware");
const ImageController = require("../../Controllers/v2/v2_imageController");
const imageRouter = express.Router();

// POST - UPLOAD IMAGE
imageRouter.post("/upload/:uid", Middleware.auth, ImageController.upload);

// GET - GET ALL IMAGE
imageRouter.get("/", ImageController.getAllImage);

// GET - GET IMAGE BY ID
imageRouter.get("/:id", ImageController.getImageById);

// DELETE - DELETE IMAGE
imageRouter.delete("/:id", Middleware.auth, ImageController.deleteImage);

module.exports = imageRouter;