import bcrypt from "bcryptjs";
import _ from "lodash";
import { User, validateUser, validate } from "../models/user";
import express from "express";
import auth from "../middleware/auth";
import { logger } from "../startup/logging";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
});
//register
router.post('/register', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already registered.");

        user = new User(_.pick(req.body, ["name", "email", "password"]));

        bcrypt.genSalt(10, async function (err, salt) {
            if (err) {
                logger.error(err);
                return res.status(500);
            }
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                if(err){
                    logger.error(err);
                    return res.status(500); 
                }
                user.password = hash;
                await user.save();

                const token = user.generateAuthToken();
                res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
            });
        });

        // res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
});
//login
router.post('/login', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findOne({ email: req.body.email });


        if (!user) return res.status(400).send("Invalid Email or Password.");

        bcrypt.compare(req.body.password, user.password, async function (err, validPassword) {
            if(err){
                logger.error(err);
                return res.status(500) ;
            }
            if (!validPassword) return res.status(400).send("Invalid Email or Password.");
            const token = user.generateAuthToken();
            res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));

        });
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
});

export default router;