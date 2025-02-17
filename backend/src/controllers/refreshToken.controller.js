const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generateTokens");

exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate new access token
        const accessToken = generateAccessToken({ id: decoded.id });
        res.json({ accessToken });
    });
};
