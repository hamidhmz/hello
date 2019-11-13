const config = require("config");
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
const { User } = require("../models/user");
const { logger } = require("../startup/logging");


// Optionally define keys to sign cookie values
// to prevent client tampering
module.exports = async function (req, res, next) {
    let decoded;
    
    // var cookies = new Cookies(req, res, { keys: keys });
    const cookies = new Cookies(req, res);

    const token = cookies.get("token");
    if (!token) {
        res.redirect("/login");
        return;
    }
    try {

        decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    } catch (e) {
        res.clearCookie("token").redirect("/login");
        // cookies.set('token', "1",{maxAge: Date.now()});
    }

    req.user = decoded;
    try {
        const user = await User.find({ _id: req.user._id }).select({ profileImage: 1 });
        if (user.length) {
            next();
        } else {
            res.clearCookie("token").redirect("/login");
        }
    } catch (e) {
        logger.error(e);
        res.clearCookie("token").redirect("/login");
    }
}