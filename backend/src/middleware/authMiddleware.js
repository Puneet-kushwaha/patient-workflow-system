const jwt = require("jsonwebtoken");
const { UserToken } = require("../models");

const auth = (roles = []) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const tokenExists = await UserToken.findOne({ where: { token } });
            if (!tokenExists) return res.status(401).json({ message: "Token invalid or expired" });

            if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ message: "Forbidden" });

            req.user = decoded;
            next();
        } catch {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = auth;
