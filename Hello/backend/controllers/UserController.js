/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUser, validate, validateForEdit, validateForChangePassword } = require('../models/user');
const { ContactUs, validationForContactForm } = require('../models/ContactUs');
const { logger } = require('../startup/logging');
const { findUserAndReturnWithId } = require('../lib/user.js');

const userDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
};

const register = async (req, res) => {
    logger.info(req.body);
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');

        user = new User(_.pick(req.body, ['name', 'email', 'password']));

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
                user.passwordReveal = req.body.password;
                user.password = hash;
                await user.save();

                const token = user.generateAuthToken();
                res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
            });
        });

        // res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
};

const login = async (req, res) => {
    logger.info(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findOne({ email: req.body.email });


        if (!user) return res.status(400).send('Invalid Email or Password.');

        bcrypt.compare(req.body.password, user.password, async function (err, validPassword) {
            if (err) {
                logger.error(err);
                return res.status(500);
            }
            if (!validPassword) return res.status(400).send('Invalid Email or Password.');
            const token = user.generateAuthToken();
            res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));

        });
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
};

const editNameAndEmail = async (req, res) => {
    const { error } = validateForEdit(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await findUserAndReturnWithId(req);

        if (!user) return res.status(400).send('Invalid Token.');

        User.findById(user._id, async (err, doc) => {
            if (err) { logger.info(err); return res.status(500); }
            if (Object.keys(doc).length) {
                doc.name = req.body.name;
                doc.email = req.body.email;
                const thisUser = await User.find({ 'email': doc.email, '_id': user._id });
                if (!thisUser.length) {
                    const duplicateEmailUser = await User.find({ 'email': doc.email });
                    if (duplicateEmailUser.length) {
                        return res.status(400).send('duplicate email.');
                    }
                }
                doc.save((err) => {
                    if (err) {
                        if (err) return res.status(500);
                    }

                    res.status(200).send({ 'done': true });
                });
            } else return res.status(400).send('invalid user');
        });
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
};

const editPassword = async (req, res) => {
    const { error } = validateForChangePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        let user = await User.findOne({ '_id': req.user._id });
        if (!user) return res.status(400).send('Invalid Token.');

        /* -------------------------- compare two passwords ------------------------- */
        bcrypt.compare(req.body.oldPassword, user.password, async function (err, validPassword) {
            if (err) {
                logger.error(err);
                return res.status(500);
            }
            if (!validPassword) return res.status(400).send('Your Previous Password didn\'t Match.');
            if (req.body.newPassword != req.body.confirmPassword) {
                return res.status(400).send('Your new Password And Confirm didn\'t Match.');
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

                        res.status(200).send({ 'done': true });
                    });
                });
            }
        });
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
};

const contactForm = async (req, res) => {
    const { error } = validationForContactForm(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.ip = req.connection.remoteAddress;
    req.body.ip2 = req.headers['x-forwarded-for'];

    try {
        await ContactUs.create(
            req.body
        );
        logger.info(req.body);
        res.send({ msg: 'OK' });
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
};

const list = async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        logger.error(error);
        return res.status(500);
    }
};

module.exports = {
    userDetails,
    register,
    login,
    editNameAndEmail,
    editPassword,
    contactForm,
    list
};