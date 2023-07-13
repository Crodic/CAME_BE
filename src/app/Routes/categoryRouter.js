const express = require("express");
const categoryRouter = express.Router();
const CategoryController = require("../Controllers/categoryController");
const Middleware = require("../Middleware/middleware");


// GET - CATEGORY - /v1/api/category/:id
categoryRouter.get("/:id", CategoryController.getCategory);

//POST - CATEGORY - /v1/api/category/create
categoryRouter.post("/create", Middleware.auth, Middleware.checkRoleAdmin, CategoryController.createCategory);

// GET - LIST CATEGORY - /v1/api/category/all
categoryRouter.get("/", CategoryController.getAll);

module.exports = categoryRouter;