const refreshTokenModel = require("../../Models/refreshTokenModel");
const UserModel = require("../../Models/userModel");
const { hashPassword, getAccessToken, getRefreshToken } = require("../../Utility/functions");

const UserController = {

    // REGISTER (username, password, name, email, phone, age) on Body (CHECKED)
    register: async (req, res, next) => {
        try {
            const { username, password, name, email, phone, age } = req.body;
            let dataPassword = await hashPassword(password);
            const newUser = new UserModel({
                username, password: dataPassword, name, email, phone, age
            })
            const userRegister = await newUser.save();
            req.body.userRegister = userRegister;
            return next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // LOGIN (username, password) on Body (CHECKED)
    login: async (req, res) => {
        try {
            const { userId, role } = req.body; // in middleware findAccount

            // Handle Delete Trash Token in database
            await refreshTokenModel.findOneAndDelete({ user: userId })

            // Create Token and save Refresh Token on database
            const accessToken = getAccessToken(userId, role);
            const refreshToken = getRefreshToken(userId, role);
            const newToken = new refreshTokenModel({ user: userId, refresh_token: refreshToken });
            await newToken.save();
            res.status(200).json({ user_id: userId, access: accessToken, refresh: refreshToken });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // LOGOUT (token in Headers, id in params) (CHECKED)
    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            await refreshTokenModel.findByIdAndDelete(refreshToken._id);
            res.status(201).json({ msg: "Logout Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // FIND USER BY TAG NAME (name in query) (CHECKED)
    findUserByName: async (req, res) => {
        try {
            const { name } = req.query;
            const users = await UserModel.find({ name })
            res.status(200).json({ msg: "Successfully", total: users.length, results: users })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // GET ALL USER (token in Headers - only ADMIN) (CHECKED)
    getAllUser: async (req, res) => {
        try {
            let { page } = req.query;
            if (!page || page < 1 || isNaN(page)) page = 1;
            const pageSize = process.env.PAGE_SIZE_USER || 20;
            const skip = (page - 1) * pageSize;
            const total = await UserModel.countDocuments();
            const listUsers = await UserModel.find().skip(skip).limit(pageSize);
            const totalPage = Math.ceil(total / pageSize);
            return res.status(200).json({ page: page, total: total, total_page: totalPage, results: listUsers })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // CHANGE ROLE (token in Headers, newRole, userIdChange in Body - Only ADMIN) (CHECKED)
    changeRoleUser: async (req, res) => {
        try {
            const { newRole, userIdChange } = req.body;
            await UserModel.findByIdAndUpdate(userIdChange, { role: newRole });
            res.status(201).json({ msg: "Update Role Successfully", user: userIdChange, new_role: newRole })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // CHANGE AVATAR (token in Headers, avatar in Body) (CHECKED)
    changeAvatar: async (req, res) => {
        try {
            const { avatar, token } = req.body; // token in Middleware auth
            const { id } = req.params;
            if (token.id !== id) return res.status(403).json({ msg: "You Don't Have Access This Action" })
            await UserModel.findByIdAndUpdate(id, { avatar })
            res.status(201).json({ msg: "Change avatar successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // CHANGE INFORMATION USER (id in params, token in Headers, attr in Body) (CHECKED)
    changeInformationUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { email, phone, name, age, token } = req.body; // token in Middleware auth
            if (token.id !== id) return res.status(403).json({ msg: "You Don't Have Access This Action" })
            await UserModel.findByIdAndUpdate(id, { email, phone, name, age });
            res.status(201).json({ msg: "Update successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // CHANGE PASSWORD (token in Headers, username, password, new_password in Body, id in params)
    changePassword: async (req, res) => {
        try {
            const { new_password, token } = req.body; // Token in middleware auth
            const { id } = req.params;
            if (token.id !== id) return res.status(403).json({ msg: "You Don't Have Access This Action" })
            const hashNewPassword = await hashPassword(new_password);
            await UserModel.findByIdAndUpdate(token.id, { $set: { password: hashNewPassword } })
            res.status(201).json({ msg: "Update Password Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // REFRESH TOKEN (token in headers, id in params) (CHECKED)
    refreshToken: async (req, res) => {
        try {
            const { tokenData } = req.body;
            const accessToken = getAccessToken(tokenData.id, tokenData.role);
            const refreshToken = getRefreshToken(tokenData.id, tokenData.role);
            const newRefreshToken = new refreshTokenModel({
                refresh_token: refreshToken,
                user: tokenData.id,
            })
            await newRefreshToken.save();
            res.status(200).json({ user_id: tokenData.id, access: accessToken, refresh: refreshToken })
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },
}

module.exports = UserController