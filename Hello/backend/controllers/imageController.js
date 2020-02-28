'use strict';

const { User } = require('../models/user');
const path = require('path');
const fs = require('mz/fs');
const { logger } = require('./../startup/logging');
const { base64EncodeFile } = require('../lib/files');
const defaultImagePath = '/../defaultImages/default.png';

/* -------------------------------------------------------------------------- */
/*                       get profile other people image                       */
/* -------------------------------------------------------------------------- */

const profileImage = async (req, res) => {
    const image = path.join(__dirname + defaultImagePath);
    try {
        const thisUser = await User.find({ email: req.params.email }).select({
            profileImage: 1
        });
        const exists = await fs.exists(thisUser[0].profileImage);
        if (exists) {
            res.sendFile(thisUser[0].profileImage);
        } else {
            res.sendFile(image);
        }
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
};

/* -------------------------------------------------------------------------- */
/*                           get user his own image                           */
/* -------------------------------------------------------------------------- */

const ownerProfileImage = async (req, res) => {
    let previousImage;
    try {
        const image = path.join(__dirname + defaultImagePath);

        const thisUser = await User.find({ _id: req.user._id }).select({
            profileImage: 1
        });
        const exists = await fs.exists(thisUser[0].profileImage);
        if (exists) {
            previousImage = thisUser[0].profileImage;
        } else {
            previousImage = image;
        }
        const base64str = base64EncodeFile(previousImage);
        res.send(base64str);
    } catch (e) {
        logger.error(e);
        const image = path.join(__dirname + defaultImagePath);
        previousImage = image;
        const base64str = base64EncodeFile(previousImage);
        res.send(base64str);
    }
};

/* -------------------------------------------------------------------------- */
/*                                upload Image                                */
/* -------------------------------------------------------------------------- */

const uploadImage = async (req, res) => {
    try {
        const tempPath = path.join(__dirname, '../' + req.file.path);
        const targetPath = path.join(
            __dirname,
            '../' +
                req.file.path +
                path.extname(req.file.originalname).toLowerCase()
        );
        if (
            path.extname(req.file.originalname).toLowerCase() === '.png' ||
            path.extname(req.file.originalname).toLowerCase() === '.jpg' ||
            path.extname(req.file.originalname).toLowerCase() === '.gif' ||
            path.extname(req.file.originalname).toLowerCase() === '.jpeg' ||
            path.extname(req.file.originalname).toLowerCase() === '.TIFF'
        ) {
            let previousImage = false;
            const thisUser = await User.find({ _id: req.user._id }).select({
                profileImage: 1
            });
            previousImage = thisUser[0].profileImage;

            await User.update(
                { _id: req.user._id },
                {
                    $set: {
                        profileImage: targetPath
                    }
                }
            );
            if (previousImage) {
                const exists = await fs.exists(previousImage);
                if (exists) {
                    await fs.unlink(previousImage);

                    await fs.rename(tempPath, targetPath);

                    res.status(200)
                        .contentType('text/plain')
                        .end('File uploaded!');
                } else {
                    await fs.rename(tempPath, targetPath);

                    res.status(200)
                        .contentType('text/plain')
                        .end('File uploaded!');
                }
            } else {
                const exists = await fs.exists(tempPath);
                if (exists) {
                    await fs.rename(tempPath, targetPath);

                    res.status(200)
                        .contentType('text/plain')
                        .end('File uploaded!');
                }
            }
        } else {
            await fs.unlink(tempPath);

            res.status(403)
                .contentType('text/plain')
                .end('Only images files are allowed!');
        }
    } catch (e) {
        logger.error(e);
        res.status(500);
    }
};

module.exports = {
    profileImage,
    ownerProfileImage,
    uploadImage
};
