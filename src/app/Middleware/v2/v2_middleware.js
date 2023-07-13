const refreshTokenModel = require("../../Models/refreshTokenModel");
const UserModel = require("../../Models/userModel");
const { decodePassword, verifyToken, getTokenInHeaders } = require("../../Utility/functions");

const Middleware = {

    // CHECK AUTH USER (Authentication)
    auth: (req, res, next) => {
        // Check Token
        const token = getTokenInHeaders(req);
        if (!token) return res.status(403).json({ msg: "Token Invalid", type: "Authentication" });

        // Verify Token
        const tokenData = verifyToken(token, process.env.ACCESS_TOKEN_KEY); // => tokenData = {id: user_id, role: "user", exp, ...}
        if (!tokenData) return res.status(401).json({ msg: "Token Expired", type: "Authentication" })

        // Assign tokenData to req.body.token
        req.body.token = tokenData
        next();
    },

    // Find Account with username (LOGIN_Step 1)
    findAccount: async (req, res, next) => {
        try {
            const { username } = req.body;
            // Find User with username
            const user = await UserModel.findOne({ username });
            if (!user) return res.status(404).json({ msg: "User Not Found", type: "Username not Exist" });

            // Assign user in database to req.body
            req.body.hashPassword = user.password;
            req.body.userId = user._id;
            req.body.role = user.role;

            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Validate Password with password from Client and password in Database (LOGIN_Step 2)
    validatePassword: async (req, res, next) => {
        try {
            const { password, hashPassword } = req.body;
            const checkPassword = await decodePassword(password, hashPassword); // => true/false
            if (!checkPassword) return res.status(404).json({ msg: "Password Invalid", type: "Validate Password" })
            next();
        } catch (error) {
            return res.status(404).json({ msg: "Password Invalid", error: error.name })
        }
    },

    // Check refresh token in headers and database (LOGOUT Step 1)
    checkRefreshToken: async (req, res, next) => {
        try {
            const { id } = req.params;
            const token = getTokenInHeaders(req);
            if (!token) return res.status(403).json({ msg: "You Don't Have Access" }) // null or string

            // Verify Refresh Token with jwt. If false => token expired
            let dataToken = verifyToken(token, process.env.REFRESH_TOKEN_KEY)
            if (!dataToken) return res.status(401).json({ msg: "Refresh Token Expired" }); // null or object

            // Verify user_id from headers UI with id from token verify.
            if (dataToken.id !== id) return res.status(403).json({ msg: "You Don't Have Access with this token" })

            // Verify Refresh Token with database. If not exist => trash token
            const checkToken = await refreshTokenModel.findOne({ user: dataToken.id, refresh_token: token });
            if (!checkToken) return res.status(403).json({ msg: "Refresh Token Invalid" }) // undefine or object
            req.body.refreshToken = checkToken;
            req.body.tokenData = dataToken;
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Define role Admin (Authentication - Role Admin)
    checkRoleAdmin: async (req, res, next) => {
        try {
            const { role } = req.body.token;
            if (role !== "admin") return res.status(403).json({ msg: "Your role cannot access" });
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Find token and delete (LOGOUT Step 2)
    deleteRefreshToken: async (req, res, next) => {
        try {
            const { _id } = req.body.refreshToken;
            const deleteToken = await refreshTokenModel.findByIdAndDelete(_id);
            if (!deleteToken) return res.status(404).json({ msg: "Refresh Token Not Found" })
            next();
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    }
}

module.exports = Middleware;