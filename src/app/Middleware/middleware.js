const refreshTokenModel = require("../Models/refreshTokenModel");
const UserModel = require("../Models/userModel");
const { decodePassword, verifyToken, getTokenInHeaders } = require("../Utility/functions");


const Middleware = {

    // Check Access Token from UI Headers => set - req.body.user -
    auth: async (req, res, next) => {
        const token = getTokenInHeaders(req);
        if (!token) return res.status(403).json({ msg: "Token Invalid", type: "Authentication" });
        const dataUser = verifyToken(token, process.env.ACCESS_TOKEN_KEY);
        if (!dataUser) return res.status(401).json({ msg: "Token expired" })
        req.body.user = dataUser;
        next();
    },

    // Check user in database with username => set - req.body.user -
    findAccount: async (req, res, next) => {
        try {
            const { username } = req.body;
            let user = await UserModel.findOne({ username });
            if (!user) return res.status(404).json({ msg: "User Not Found" });
            req.body.user = user;
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Check hash password with password from UI
    validatePassword: async (req, res, next) => {
        try {
            const { password, user } = req.body;
            let decodePasswordUser = await decodePassword(password, user.password);
            if (!decodePasswordUser) return res.status(404).json({ msg: "Password Invalid" })
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Check refresh token in headers and database => set - req.body.tokenId - req.body.data -
    checkRefreshToken: async (req, res, next) => {
        try {
            const token = getTokenInHeaders(req);
            if (!token) return res.status(403).json({ msg: "Token Invalid", type: "Authentication" });

            const { userId } = req.body;
            if (!token) return res.status(403).json({ msg: "You Don't Have Access" }) // undefine or string

            // Verify Refresh Token with jwt. If undefine => token expired
            let result = verifyToken(token, process.env.REFRESH_TOKEN_KEY)
            if (!result) return res.status(401).json({ msg: "Refresh Token Expired" }); // null or object

            // Verify userId from headers UI with id from token verify.
            if (result.id !== userId) return res.status(403).json({ msg: "You Don't Have Access with this token" })

            // Verify Refresh Token with database. If not exist => trash token
            const checkToken = await refreshTokenModel.findOne({ user: userId, refresh_token: token });
            if (!checkToken) return res.status(403).json({ msg: "Refresh Token Invalid" }) // undefine or object
            req.body.tokenId = checkToken._id;
            req.body.data = result;
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Define role Admin
    checkRoleAdmin: async (req, res, next) => {
        try {
            const { role } = req.body.user;
            if (role !== "admin") return res.status(403).json({ msg: "Your role cannot access" });
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Define USER
    defineUser: async (req, res, next) => {
        let { id } = req.params;
        const { user } = req.body;
        if (id !== user.id) return res.status(403).json({ msg: "You Don't Have Access" })
        next();
    },

    // Find token and delete
    deleteRefreshToken: async (req, res, next) => {
        try {
            const { tokenId } = req.body;
            await refreshTokenModel.findByIdAndDelete(tokenId);
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    }
}

module.exports = Middleware;