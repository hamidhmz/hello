/* eslint-disable linebreak-style */
/*
 
   __  __       _            _          _  
  |  \/  | __ _(_)_ __      / \   _ __ (_) 
  | |\/| |/ _` | | '_ \    / _ \ | '_ \| | 
  | |  | | (_| | | | | |  / ___ \| |_) | | 
  |_|  |_|\__,_|_|_| |_| /_/   \_\ .__/|_| 
                                 |_|       
 
*/

/************************************************************************
 *  GET           /profile-image/:email    other users image            *
 *  GET           /profile-image           user own image base64        *
 *  POST          /upload                  upload image for user        *
 *  GET           /                        EDIT USER NAME OR USER EMAIL *
 *  GET           /login                   RENDER LOGIN PAGE            *
 *  GET           /messages                RENDER MESSAGES PAGE         *
 *  GET           /settings                RENDER SETTING PAGE          *
 *  GET           /video-call              RENDER VIDEO CALL PAGE       *
 *  GET           /voip                    RENDER VOIP PAGE             *
 ************************************************************************/

const express = require('express');
const authView = require('../middleware/authView');
const { User } = require('../models/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { logger } = require('./../startup/logging');
const { base64_encode } = require('../lib/files');

const imageArray = ['https://dummyimage.com/100x100/7a6bed/7a6bed.png'];

const router = express.Router();
const defaultImagePath = '/../defaultImages/default.png';
const upload = multer({
    dest: './uploads'
});

/* -------------------------------------------------------------------------- */
/*                      return other users profile image                      */
/* -------------------------------------------------------------------------- */

/**
 * /profile-image/:email => other users image.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @controller	imageController.js	
 * @param	email	
 * @cookie  token => valid token
 * @return  user image file 
 */
router.get('/profile-image/:email', authView, async function (req, res) {

    const image = path.join(__dirname + defaultImagePath);
    try {
        const thisUser = await User.find({ email: req.params.email }).select({ profileImage: 1 });
        fs.exists(thisUser[0].profileImage, function (exists) {
            if (exists) {
                res.sendFile(thisUser[0].profileImage);
            } else {
                res.sendFile(image);
            }
        });
    } catch (error) {
        logger.error(error);
        res.status(500);
    }
});

/* -------------------------------------------------------------------------- */
/*                            user own image base64                           */
/* -------------------------------------------------------------------------- */

/**
 * /profile-image => user own image base64 .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  user base64 image  
 */
router.get('/profile-image', authView, async function (req, res) {
    let previousImage;
    try {

        const image = path.join(__dirname + defaultImagePath);

        const thisUser = await User.find({ _id: req.user._id }).select({ profileImage: 1 });

        fs.exists(thisUser[0].profileImage, function (exists) {
            if (exists) {
                previousImage = thisUser[0].profileImage;
            } else {
                previousImage = image;
            }
            const base64str = base64_encode(previousImage);
            res.send(base64str);
        });
    } catch (e) {
        logger.error(e);
        const image = path.join(__dirname + defaultImagePath);
        previousImage = image;
        fs.exists(previousImage, async function () {
            const base64str = base64_encode(previousImage);
            res.send(base64str);
        });
    }

});

/* -------------------------------------------------------------------------- */
/*                                upload image                                */
/* -------------------------------------------------------------------------- */

/**
 * /upload => upload image for user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  status 200 and "File uploaded" text  
 */
router.post('/upload', authView, upload.single('filepond' /* name attribute of <file> element in your form */), async function (req, res) {
    try {
        const tempPath = path.join(__dirname, '../' + req.file.path);
        const targetPath = path.join(__dirname, '../' + req.file.path + (path.extname(req.file.originalname).toLowerCase()));
        if (path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg' || path.extname(req.file.originalname).toLowerCase() === '.gif' || path.extname(req.file.originalname).toLowerCase() === '.jpeg' || path.extname(req.file.originalname).toLowerCase() === '.TIFF') {
            let previousImage = false;
            const thisUser = await User.find({ _id: req.user._id }).select({ profileImage: 1 });
            previousImage = thisUser[0].profileImage;

            User.update({ _id: req.user._id }, {
                // mongodb update operators: https://docs.mongodb.com/manual/reference/operator/update/
                $set: {
                    profileImage: targetPath,
                }
            }, async function () {
                if (previousImage) {
                    fs.exists(previousImage, async function (exists) {
                        if (exists) {
                            fs.unlink(previousImage, err => {
                                if (err) {
                                    logger.error(err);
                                    return res.status(500);
                                }

                                fs.rename(tempPath, targetPath, err => {
                                    if (err) {
                                        logger.error(err);
                                        return res.status(500);
                                    }

                                    res
                                        .status(200)
                                        .contentType('text/plain')
                                        .end('File uploaded!');
                                });
                            });
                        } else {
                            fs.rename(tempPath, targetPath, err => {
                                if (err) {
                                    logger.error(err);
                                    return res.status(500);
                                }

                                res
                                    .status(200)
                                    .contentType('text/plain')
                                    .end('File uploaded!');
                            });
                        }

                    });
                } else {
                    fs.exists(tempPath, (exists) => {
                        fs.rename(tempPath, targetPath, err => {
                            if (err) {
                                logger.error(err);
                                return res.status(500);
                            }

                            res
                                .status(200)
                                .contentType('text/plain')
                                .end('File uploaded!');
                        });
                    });
                }

            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) {
                    logger.error(err);
                    return res.status(500);
                }

                res
                    .status(403)
                    .contentType('text/plain')
                    .end('Only images files are allowed!');
            });
        }
    } catch (e) {
        logger.error(e);
        res.status(500);
    }
});

/* -------------------------------------------------------------------------- */
/*                      render and show main page to user                     */
/* -------------------------------------------------------------------------- */
/**
 * / => render and show main page to user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  render index page for user  
 */
router.get('/', authView, async function (req, res) {
    res.render('index', { page: 'index' });
});

/* -------------------------------------------------------------------------- */
/*               render and show login and register page to user              */
/* -------------------------------------------------------------------------- */
/**
 * /login => render and show login and register page to user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @return  render login and register page for user  
 */
router.get('/login', async function (req, res) {
    res.render('login', { page: 'login' });
});


/* -------------------------------------------------------------------------- */
/*                    render and show message page to user                    */
/* -------------------------------------------------------------------------- */

/**
 * /messages => render and show message page to user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  render message page for user  
 */
router.get('/messages', authView, async function (req, res) {
    res.render('messages', { page: 'messages' });
});

/* -------------------------------------------------------------------------- */
/*                    render and show settings page to user                   */
/* -------------------------------------------------------------------------- */

/**
 * /settings => render and show settings page to user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  render settings page for user  
 */
router.get('/settings', authView, async function (req, res) {
    res.render('settings', { page: 'settings' });
});

/* -------------------------------------------------------------------------- */
/*                   render and show video-call page to user                  */
/* -------------------------------------------------------------------------- */

/**
 * /settings => render and show video-call page to user .
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  render videoCall page for user  
 */
router.get('/video-call', authView, async function (req, res) {
    res.render('videoCall', { page: 'video-call' });
});

/* -------------------------------------------------------------------------- */
/*                   render and show video-call page to user                  */
/* -------------------------------------------------------------------------- */

/**
 * /voip => render and show voip page to user .this page is for voice call 
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @cookie  token => valid token
 * @return  render voip page for user  
 */
router.get('/voip', authView, async function (req, res) {
    res.render('voip', { page: 'voip' });
});

/* -------------------------------------------------------------------------- */
/*                   render and show myEman page to user                  */
/* -------------------------------------------------------------------------- */

/**
 * /myEman => render and show to eman 
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @return  render eman page for eman  
 */
router.get('/myEman', async function (req, res) {
    logger.info(req.connection.remoteAddress);
    res.render('eman', { page: 'eman' });
});

router.get('/eman', async function (req, res) {
    logger.info('miss mary');
    res.render('eman', { page: 'eman' });
});
module.exports = router;