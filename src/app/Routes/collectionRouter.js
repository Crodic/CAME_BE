const express = require("express");
const Middleware = require("../Middleware/middleware");
const CollectionsController = require("../Controllers/collectionsController");
const collectionRouter = express.Router();

// POST - CREATE COLLECTION - /v1/api/create/:id <user> <=> Check Access Token in Headers -> Define user when action -> Create Collection
collectionRouter.post("/create/:id", Middleware.auth, Middleware.defineUser, CollectionsController.create);

// GET - GET COLLECTION BY TAG - /v1/api/ <=> Get collections
collectionRouter.get("/", CollectionsController.findCollectionByTag);

// PUT - ADD IMAGE TO COLLECTION - /v1/api/add_image/:id <=> Check Access Token in Headers -> Add image to collection with user id
collectionRouter.put("/add_image/:id", Middleware.auth, CollectionsController.addImage);

// PUT - UP TO LIKE OR VIEW - v1/api/action/:id
collectionRouter.put("/action/:id", Middleware.auth, CollectionsController.upAction);

// PUT - DOWN TO LIKE - v1/api/action_unlike/:id
collectionRouter.put("/action_unlike/:id", Middleware.auth, CollectionsController.downLike);

//PUT - CHANGE INFORMATION
collectionRouter.put("/change/:id", Middleware.auth, Middleware.defineUser, CollectionsController.changeInformation);

//DELETE - DELETE COLLECTION - NO TEST
collectionRouter.delete("/delete/:id", Middleware.auth, Middleware.defineUser, CollectionsController.deleteCollection);

module.exports = collectionRouter;
