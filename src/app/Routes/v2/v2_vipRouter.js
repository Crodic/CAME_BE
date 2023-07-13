const express = require("express");
const Middleware = require("../../Middleware/v2/v2_middleware");
const VipController = require("../../Controllers/v2/v2_vipController");
const vipRouter = express.Router();

// PUT - UP VIP
vipRouter.put("/", Middleware.auth, VipController.upExp);

// VIEW VIP
vipRouter.get("/view", Middleware.auth, VipController.getVipByUser);

module.exports = vipRouter;