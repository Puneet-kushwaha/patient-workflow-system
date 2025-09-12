const { User, UserToken } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({
            type: "error",
            message: "Email and password required"
        });

    const user = await User.findOne({ where: { email } });
    if (!user)
        return res.status(401).json({
            type: "error",
            message: "Invalid credentials"
        });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({
            type: "error",
            message: "Invalid credentials"
        });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await UserToken.destroy({ where: { userId: user.id } });

    await UserToken.create({
        userId: user.id,
        token,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        type: "access"
    });

    res.json({
        type: "success",
        message: "Logged in Successful",
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    await UserToken.destroy({ where: { token } });

    res.json({ message: "Logged Out Successfully", type: "success" });
};
