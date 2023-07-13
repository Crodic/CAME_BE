const express = require("express");
const Middleware = require("../Middleware/middleware");
const VipController = require("../Controllers/vipController");
const vipRouter = express.Router();

// PUT - UP VIP
vipRouter.put("/", Middleware.auth, VipController.upExp);

module.exports = vipRouter;