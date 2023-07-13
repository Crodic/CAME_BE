const UserModel = require("../Models/userModel");
const refreshTokenModel = require("../Models/refreshTokenModel");
const { hashPassword, getAccessToken, getRefreshToken } = require("../Utility/functions");

const UserController = {

    // REGISTER USER
    register: async (req, res, next) => {
        try {
            const { username, password, name, email, phone, age, role } = req.body;
            let dataPassword = await hashPassword(password);
            const newUser = new UserModel({
                username, password: dataPassword, name, email, phone, age, role
            })
            const result = await newUser.save();
            req.body.result = result;
            return next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // LOGIN USER
    login: async (req, res) => {
        try {
            const { _id, role } = req.body.user;
            const token = await refreshTokenModel.findOne({ user: _id })
            if (token) {
                await refreshTokenModel.deleteMany({ user: _id });
            }
            const accessToken = getAccessToken(_id, role);
            const refreshToken = getRefreshToken(_id, role);
            const newToken = new refreshTokenModel({ user: _id, refresh_token: refreshToken });
            await newToken.save();
            res.status(200).json({ user_id: _id, access: accessToken, refresh: refreshToken });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // LOGOUT USER
    logout: async (req, res) => {
        try {
            const { tokenId } = req.body;
            await refreshTokenModel.findByIdAndDelete(tokenId);
            res.status(201).json({ msg: "Logout Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    //Find User By Name
    findUserByName: async (req, res) => {
        try {
            let users = [];
            const { name } = req.query;
            if (!name) {
                users = await UserModel.find();
            } else {
                users = await UserModel.find({ name })
            }
            if (users.length === 0) return res.status(200).json({ msg: "Not found user", results: [] })
            res.status(200).json({ msg: "Successfully", total: users.length, results: users })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // GET ALL USER WITH PAGINATION
    getUsers: async (req, res) => {
        try {
            let { page } = req.query;
            if (!page || page < 1 || isNaN(page)) page = 1;
            const pageSize = process.env.PAGE_SIZE_USER;
            const skip = (page - 1) * pageSize;
            const total = await UserModel.countDocuments();
            const listUsers = await UserModel.find().skip(skip).limit(pageSize);
            const totalPage = Math.ceil(total / pageSize);
            return res.status(200).json({ page: page, total: total, total_page: totalPage, results: listUsers })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // EDIT ROLE USER
    changeRoleUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            await UserModel.findByIdAndUpdate(id, { role: role });
            res.status(201).json({ msg: "Update Role Successfully", id, role })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Change Avatar User
    changeAvatar: async (req, res) => {
        try {
            const { avatar } = req.body;
            const { id } = req.params;
            await UserModel.findByIdAndUpdate(id, { avatar })
            res.status(201).json({ msg: "Change avatar successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // REFRESH ACCESS TOKEN WITH REFRESH TOKEN
    refreshToken: async (req, res) => {
        try {
            const { data } = req.body;
            const accessToken = getAccessToken(data.id, data.role);
            const refreshToken = getRefreshToken(data.id, data.role);
            const newRefreshToken = new refreshTokenModel({
                refresh_token: refreshToken,
                user: data.id,
            })
            await newRefreshToken.save();
            res.status(200).json({ user_id: data.id, access: accessToken, refresh: refreshToken })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Change Information User (email - phone - name - age);
    changeInformationUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { email, phone, name, age } = req.body;
            await UserModel.findByIdAndUpdate(id, { email, phone, name, age });
            res.status(201).json({ msg: "Update successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { new_password } = req.body;
            const { _id } = req.body.user;
            const hashNewPassword = await hashPassword(new_password);
            await UserModel.findByIdAndUpdate(_id, { $set: { password: hashNewPassword } })
            res.status(201).json({ msg: "Update Password Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    }
}


module.exports = UserController;