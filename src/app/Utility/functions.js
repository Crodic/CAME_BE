const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hash Password Function => password: string -> return hash: string
const hashPassword = async (password) => {
    let hash = await bcrypt.hash(password, 10);
    return hash;
}

// Decode Password Function => password: String, hashPassword: String -> return true/false
const decodePassword = async (password, hashPassword) => {
    let result = await bcrypt.compare(password, hashPassword);
    return result;
}

// Get Access Token Function => id: String, role: String -> return token: String
const getAccessToken = (id, role) => {
    let token = jwt.sign({ id, role }, process.env.ACCESS_TOKEN_KEY, { expiresIn: "10m" })
    return token;
}

// Get Refresh Token Function => id: String, role: String -> return token: String
const getRefreshToken = (id, role) => {
    let token = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_KEY, { expiresIn: "1d" })
    return token;
}

// Verify Token Function => token: String, key: String -> return object/false
const verifyToken = (token, key) => {
    try {
        let result = jwt.verify(token, key);
        return result;
    } catch (error) {
        return false;
    }
}

// Take token in Headers
const getTokenInHeaders = (req) => {
    const authorization = req.headers["authorization"];
    if (!authorization) return null;
    const token = authorization.split(" ")[1];
    return token;
}


module.exports = { hashPassword, decodePassword, getAccessToken, getRefreshToken, verifyToken, getTokenInHeaders }