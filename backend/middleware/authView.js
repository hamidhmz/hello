import config from "config";
import jwt from "jsonwebtoken";
// import Cookies from "cookies";

export default function (req, res, next) {
    const token = req.cookies["token"];
    // const cookies = new Cookies(req, res);
    // if(!token)return res.redirect("/login");
    // console.log(jwt.verify(token,config.get("jwtPrivateKey")));
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (ex) {
        console.log(ex);
        // cookies.set('token', {expires: Date.now()});
        // console.dir(token);
        res.redirect("/login");
    }

}