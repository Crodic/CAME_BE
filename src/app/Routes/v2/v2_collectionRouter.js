const express = require("express");
const Middleware = require("../../Middleware/v2/v2_middleware");
const CollectionsController = require("../../Controllers/v2/v2_collectionController");
const collectionRouter = express.Router();

// POST - CREATE COLLECTION
collectionRouter.post("/create", Middleware.auth, CollectionsController.create);

// GET - FIND COLLECTION BY TAG
collectionRouter.get("/", CollectionsController.findCollectionByTag);

// POST - ADD IMAGE TO COLLECTION
collectionRouter.put("/add/:cid", Middleware.auth, CollectionsController.addImage);

// PUT - LIKE OR VIEW COLLECTION
collectionRouter.put("/up/:cid", Middleware.auth, CollectionsController.upAction);

// PUT - UNLIKE COLLECTION
collectionRouter.put("/down/:cid", Middleware.auth, CollectionsController.unLike);

// PUT - UPDATE INFORMATION COLLECTION
collectionRouter.put("/update/:cid", Middleware.auth, CollectionsController.changeInformation);

// DElETE - DELETE COLLECTION
collectionRouter.delete("/delete/:cid", Middleware.auth, CollectionsController.deleteCollection);


module.exports = collectionRouter;
