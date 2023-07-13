const express = require("express");
const UserController = require("../Controllers/userController");
const Middleware = require("../Middleware/middleware");
const VipController = require("../Controllers/vipController");
const userRouter = express.Router();

// POST - USER REGISTER - /v1/api/user/register {v2 - checked}
// Body: username, password, email, phone, name, {*role}
userRouter.post("/register", UserController.register, VipController.createVip);

// POST - USER LOGIN - /v1/api/user/login <=> Check user in database -> validate password -> create token and login {v2/checked}
// Body: username, password
userRouter.post("/login", Middleware.findAccount, Middleware.validatePassword, UserController.login);

// DELETE - USER LOGOUT - /v1/api/user/logout <=> Check refresh token in headers -> find token in database -> delete token and logout {v2/checked}
// Body: userId
// Headers: Refresh Token
userRouter.delete("/logout", Middleware.checkRefreshToken, UserController.logout);

// GET - USER FIND NAME - /v1/api/user/find_user
// Body: name
userRouter.get("/find_user", UserController.findUserByName);

// PUT - CHANGE AVATAR <=> Check Access Token in Headers -> Define User when action change Avatar -> Change Avatar user
// Body: avatar
// Params: id
// Headers: Access Token
userRouter.put("/avatar/:id", Middleware.auth, Middleware.defineUser, UserController.changeAvatar);

// GET - REFRESH TOKEN <=> Check Refresh Token in Headers -> Delete Refresh Token in database -> Send access and refresh to Client
// Body: userId
// Headers: Refresh Token
userRouter.get("/refresh_token", Middleware.checkRefreshToken, Middleware.deleteRefreshToken, UserController.refreshToken);

// PUT - CHANGE INFORMATION USER <=> Check Access Token in Headers -> Define User when account change information -> Change Information
// Body: password, email, phone, name, age
// Params: id
// Headers: Access Token
userRouter.put("/change/:id", Middleware.auth, Middleware.defineUser, UserController.changeInformationUser);

// PUT - CHANGE PASSWORD <=> Check Access Token in Headers -> Find Account in Database -> Validate Password -> Change Password
userRouter.put("/change_password/:id", Middleware.auth, Middleware.defineUser, Middleware.findAccount, Middleware.validatePassword, UserController.changePassword);

// PUT - CHANGE ROLE - TYPE: ADMIN <=> Check Access Token in headers -> check role admin in Access Token -> Edit role user
// Body: role
// Headers: Access Token
userRouter.put("/:id", Middleware.auth, Middleware.defineUser, Middleware.checkRoleAdmin, UserController.changeRoleUser);

// GET - INFORMATION USER - TYPE: ADMIN <=> Check Access Token in headers -> check role admin in Access Token -> Get information users
// Headers: Access Token
// Query: page
userRouter.get("/", Middleware.auth, Middleware.checkRoleAdmin, UserController.getUsers);


module.exports = userRouter;