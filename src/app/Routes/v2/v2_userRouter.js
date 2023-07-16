const express = require("express");
const userRouter = express.Router();
const Middleware = require("../../Middleware/v2/v2_middleware");
const UserController = require("../../Controllers/v2/v2_userController");
const VipController = require("../../Controllers/v2/v2_vipController");

// POST - REGISTER -> /v2/api/user/register
userRouter.post("/register", UserController.register, VipController.createVip);

// POST - LOGIN -> /v2/api/user/login
userRouter.post("/login", Middleware.findAccount, Middleware.validatePassword, UserController.login);

// DELETE - LOGOUT /v2/api/user/logout/:id
userRouter.delete("/logout/:id", Middleware.checkRefreshToken, UserController.logout);

// PUT - CHANGE ROLE USER - ADMIN
userRouter.put("/change_role", Middleware.auth, Middleware.checkRoleAdmin, UserController.changeRoleUser);

// GET - FIND USER BY DISPLAY NAME
userRouter.get("/find_user", UserController.findUserByName);

// GET - FIND ALL USER - ADMIN
userRouter.get("/find_all", Middleware.auth, Middleware.checkRoleAdmin, UserController.getAllUser);

// PUT - CHANGE AVATAR USER
userRouter.put("/avatar/:id", Middleware.auth, UserController.changeAvatar);

// PUT - CHANGE INFORMATION USER
userRouter.put("/information/:id", Middleware.auth, UserController.changeInformationUser);

// PUT - CHANGE PASSWORD
userRouter.put("/password/:id", Middleware.auth, Middleware.findAccount, Middleware.validatePassword, UserController.changePassword);

// POST - REFRESH TOKEN
userRouter.post("/refresh/:id", Middleware.checkRefreshToken, Middleware.deleteRefreshToken, UserController.refreshToken);

// GET - GET USER BY ID
userRouter.get("/:id", UserController.getUserById);

// POST - LOGIN ADMIN
userRouter.post("/login_admin", Middleware.findAccount, Middleware.checkRoleAdmin, Middleware.validatePassword, UserController.login);



module.exports = userRouter;