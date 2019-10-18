import config from "config";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import {User} from "../models/user";


// Optionally define keys to sign cookie values
// to prevent client tampering
export default async function (req, res, next) {
    let decoded;

    // var cookies = new Cookies(req, res, { keys: keys });
    const cookies = new Cookies(req, res);

    const token = cookies.get("token");
    if (!token){
        res.redirect("/login");
        return;
    }
    // if(!token)return res.redirect("/login");
    // console.log(jwt.verify(token,config.get("jwtPrivateKey")));
    try {

        decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    }catch (e) {
        res.clearCookie("token").redirect("/login");
        // cookies.set('token', "1",{maxAge: Date.now()});
        // console.dir(token);
    }

    req.user = decoded;
    try {
        const user = await User.find({_id: req.user._id}).select({ profileImage:1 });
        if (user.length){
            next();
        }else {
            res.clearCookie("token").redirect("/login");
            // console.dir(token);
        }
    }catch (e) {
        res.clearCookie("token").redirect("/login");
        // console.dir(token);
    }



}