/*
 
   _   _                    _          _ 
  | | | |___  ___ _ __     / \   _ __ (_)
  | | | / __|/ _ \ '__|   / _ \ | '_ \| |
  | |_| \__ \  __/ |     / ___ \| |_) | |
   \___/|___/\___|_|    /_/   \_\ .__/|_|
                                |_|      
 
*/

/******************************************************************************************
 *  GET               /hello/api/users/ME                  GET USER DETAILS               *
 *  POST              /hello/api/users/REGISTER            REGISTER NEW USER              *
 *  POST              /hello/api/users/LOGIN               USER LOGIN                     *
 *  POST              /hello/api/users/EDIT-NAME-OR-EMAIL  EDIT USER NAME OR USER EMAIL   *
 *  PUT               /hello/api/users/EDIT-PASSWORD       EDIT AND CHANGE THE PASSWORD   *
 *  POST              /hello/api/users/contact-form        SEND MESSAGE FROM CLIENT IN CV *
 ******************************************************************************************/

const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validateUser, validate, validateForEdit, validateForChangePassword, validationForContactForm } = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");
const { logger } = require("../startup/logging");
const { findUserAndReturnWithId } = require("../lib/user.js");

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                    show                                    */
/* -------------------------------------------------------------------------- */
/**
 * /me => user details.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	nothing	
 * @header  x-auth-token => valid token
 * @return  user details 
 */
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
/**
 * /register => user sign up.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	{name,email,password} => object
 * @return  token in header and name and email of user in body of the response
 */
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
/**
 * /login => user sign in.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	{email,password} => object
 * @return  token in header and name and email of user in body of the response
 */
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
/**
 * /edit-name-or-email => change name or change email ro both.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	{email,name} => object
 * @header  x-auth-token => valid token
 * @return  success => status:200 data:{done:true}
 */
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
/*                               change password                              */
/* -------------------------------------------------------------------------- */
/**
 * /edit-password => change the password.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	{oldPassword,newPassword,confirmPassword} => object
 * @header  x-auth-token => valid token
 * @return  success => status:200 data:{done:true}
 */
router.put("/edit-password", auth, async (req, res) => {
    const { error } = validateForChangePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findOne({ "_id": req.user._id });
        if (!user) return res.status(400).send("Invalid Token.");

        /* -------------------------- compare two passwords ------------------------- */
        bcrypt.compare(req.body.oldPassword, user.password, async function (err, validPassword) {
            if (err) {
                logger.error(err);
                return res.status(500);
            }
            if (!validPassword) return res.status(400).send("Your Previous Password didn't Match.");
            if (req.body.newPassword != req.body.confirmPassword) {
                return res.status(400).send("Your new Password And Confirm didn't Match.");
            } else {

                /* --------------------------- create new password -------------------------- */

                bcrypt.genSalt(10, async function (err, salt) {
                    if (err) {
                        logger.error(err);
                        return res.status(500);
                    }
                    bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
                        if (err) {
                            logger.error(err);
                            return res.status(500);
                        }
                        user.password = hash;
                        await user.save();

                        res.status(200).send({ "done": true });
                    });
                });
            }
        });
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
});
/* -------------------------------------------------------------------------- */
/*                        receive message from contact us                     */
/* -------------------------------------------------------------------------- */
/**
 * /contact-form => change the password.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @param	{name,email,subject,message} => object
 * @return  success => status:200 data:{done:true}
 */
router.post("/contact-form", async (req, res) => {
    const { error } = validationForContactForm(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.ip = req.connection.remoteAddress;
    logger.info(req.body);
    res.send({msg:"OK"});
});

module.exports = router;