const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true
    },
    password: {/// we can use joi-password-complexity
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    profileImage: String,
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    // return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("jwtPrivateKey"));
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
};
const User = mongoose.model("User", userSchema);

/* -------------------------------------------------------------------------- */
/*                            validate for sign up                            */
/* -------------------------------------------------------------------------- */

/**
 * validateUser.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	User	
 * @return	mixed
 */
function validateUser(User) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required().strip()
    };

    return Joi.validate(User, schema);
}

/* -------------------------------------------------------------------------- */
/*                             validate for login                             */
/* -------------------------------------------------------------------------- */

/**
 * validate.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	User	
 * @return	mixed
 */
function validate(User) {
    const schema = {
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required().strip()
    };

    return Joi.validate(User, schema);
}

/* -------------------------------------------------------------------------- */
/*                      validate for change email or name                     */
/* -------------------------------------------------------------------------- */

/**
 * validateForEdit.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	User	
 * @return	mixed
 */
function validateForEdit(User) {
    const schema = {
        email: Joi.string().email().min(5).max(50).required(),
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(User, schema);
}

/* -------------------------------------------------------------------------- */
/*                        validate for change password                        */
/* -------------------------------------------------------------------------- */

/**
 * validateForChangePassword.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	User	
 * @return	mixed
 */
function validateForChangePassword(User) {
    const schema = {
        oldPassword: Joi.string().min(5).max(50).required(),
        newPassword: Joi.string().min(5).max(50).required(),
        confirmPassword: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(User, schema);
}
/**
 * validation for contact form.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	User	
 * @return	mixed
 */

function validationForContactForm(User) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        subject: Joi.string().required(),
        message: Joi.string().required()
    };

    return Joi.validate(User, schema);
}

module.exports = { validateUser, validate, User, validateForEdit, validateForChangePassword, validationForContactForm };