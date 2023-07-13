const express = require("express");
const CategoryController = require("../../Controllers/v2/v2_categoryController");
const Middleware = require("../../Middleware/v2/v2_middleware");
const categoryRouter = express.Router();


// GET - CATEGORY - /v1/api/category/:id
categoryRouter.get("/:id", CategoryController.getCategory);

//POST - CATEGORY - /v1/api/category/create
categoryRouter.post("/create", Middleware.auth, Middleware.checkRoleAdmin, CategoryController.createCategory);

// GET - LIST CATEGORY - /v1/api/category/all
categoryRouter.get("/", CategoryController.getAll);

module.exports = categoryRouter;