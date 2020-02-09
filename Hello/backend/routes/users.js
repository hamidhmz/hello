/* eslint-disable linebreak-style */
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
 *  POST              /hello/api/users/list                SEND LIST OF USERS             *
 ******************************************************************************************/
const express = require('express');
const auth = require('../middleware/auth');
const { UserController } = require('../controllers');

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
router.get('/me', auth, UserController.userDetails);

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
router.post('/register', UserController.register);

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
router.post('/login', UserController.login);

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
router.post('/edit-name-or-email', auth, UserController.editNameAndEmail);

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
router.put('/edit-password', auth, UserController.editPassword);

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
router.post('/contact-form', UserController.contactForm);

/* -------------------------------------------------------------------------- */
/*                           show list of all users                           */
/* -------------------------------------------------------------------------- */
/**
 * /list => return list of all users.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @header  x-auth-token => valid token
 * @return  success => status:200 data:{done:true}
 */
router.get('/list', auth, UserController.list);

module.exports = router;