/*

__  __       _            _          _  
|  \/  | __ _(_)_ __      / \   _ __ (_) 
| |\/| |/ _` | | '_ \    / _ \ | '_ \| | 
| |  | | (_| | | | | |  / ___ \| |_) | | 
|_|  |_|\__,_|_|_| |_| /_/   \_\ .__/|_| 
|_|       

*/

/************************************************************************
 *  GET           /hello/profile-image/:email    OTHER USERS IMAGE            *
 *  GET           /hello/profile-image           USER OWN IMAGE BASE64        *
 *  POST          /hello/upload                  UPLOAD IMAGE FOR USER        *
 *  GET           /hello/                        RENDER MAIN PAGE             *
 *  GET           /hello/login                   RENDER LOGIN PAGE            *
 *  GET           /hello/messages                RENDER MESSAGES PAGE         *
 *  GET           /hello/settings                RENDER SETTING PAGE          *
 *  GET           /hello/video-call              RENDER VIDEO CALL PAGE       *
 *  GET           /hello/voip                    RENDER VOIP PAGE             *
 ************************************************************************/

'use strict';
const express = require('express');
const multer = require('multer');
const { logger } = require('./../startup/logging');
const authView = require('../middleware/authView');
const { ImageController } = require('../controllers');
const router = express.Router();
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
router.get('/profile-image/:email', authView, ImageController.profileImage);

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
router.get(
    '/profile-image',
    authView,
    ImageController.ownerProfileImage
); /* name attribute of <file> element in your form */

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
 */ router.post(
    '/upload',
    authView,
    upload.single('filepond'),
    ImageController.uploadImage
);

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
router.get('/', authView, async function(req, res) {
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
router.get('/login', async function(req, res) {
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
router.get('/messages', authView, async function(req, res) {
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
router.get('/settings', authView, async function(req, res) {
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
router.get('/video-call', authView, async function(req, res) {
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
router.get('/voip', authView, async function(req, res) {
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
router.get('/myEman', async function(req, res) {
    logger.info(req.connection.remoteAddress);
    res.render('eman', { page: 'eman' });
});

router.get('/eman', async function(req, res) {
    logger.info(req.connection.remoteAddress);
    logger.info(req.headers['x-forwarded-for']);
    logger.info('valentine');
    res.render('emanValen', { page: 'eman' });
});
module.exports = router;
