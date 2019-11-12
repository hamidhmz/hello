const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validateUser, validate, validateForEdit, validateForChangePassword } = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");
const { logger } = require("../startup/logging");
const { findUserAndReturnWithId } = require("../lib/user.js");

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                    show                                    */
/* -------------------------------------------------------------------------- */

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
});

/* -------------------------------------------------------------------------- */
/*                                  register                                  */
/* -------------------------------------------------------------------------- */

router.post("/register", async (req, res) => {
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
                if (err) {
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

/* -------------------------------------------------------------------------- */
/*                                    login                                   */
/* -------------------------------------------------------------------------- */

router.post("/login", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findOne({ email: req.body.email });


        if (!user) return res.status(400).send("Invalid Email or Password.");

        bcrypt.compare(req.body.password, user.password, async function (err, validPassword) {
            if (err) {
                logger.error(err);
                return res.status(500);
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

/* -------------------------------------------------------------------------- */
/*                             edit name or email                             */
/* -------------------------------------------------------------------------- */

router.post("/edit-name-or-email", auth, async (req, res) => {
    const { error } = validateForEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await findUserAndReturnWithId(req);

        if (!user) return res.status(400).send("Invalid Token.");

        User.findById(user._id, async (err, doc) => {
            if (err) return res.status(500);

            doc.name = req.body.name;
            doc.email = req.body.email;
            const thisUser = await User.find({ "email": doc.email, "_id": user._id });
            if (!thisUser.length) {
                const duplicateEmailUser = await User.find({ "email": doc.email });
                if (duplicateEmailUser.length) {
                    return res.status(400).send("duplicate email.");
                }
            }
            doc.save((err) => {
                if (err) {
                    if (err) return res.status(500);
                }

                res.status(200).send({ "done": true });
            });
        });
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
});

/* -------------------------------------------------------------------------- */
/*                               Change password                              */
/* -------------------------------------------------------------------------- */

router.put("/edit-password", auth, async (req, res) => {
    const { error } = validateForChangePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await findUserAndReturnWithId(req);
        if (!user) return res.status(400).send("Invalid Token.");
        
    } catch (error) {
        
    }
});

module.exports = router;