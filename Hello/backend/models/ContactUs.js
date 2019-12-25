<<<<<<< HEAD
=======
/* eslint-disable linebreak-style */
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
const mongoose = require("mongoose");
const Joi = require("joi");
const joi_objectid = require("joi-objectid");
const timeZone = require("mongoose-timezone");

Joi.objectId = joi_objectid(Joi);
<<<<<<< HEAD
const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
=======
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
        maxlength: 50
    },
    subject: {
        type: String,
        required: true,
<<<<<<< HEAD
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true
=======
        minlength: 4,
        maxlength: 50
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
    },
    ip: {
        type: String,
        required: true
    },
    ip2: {
        type: String,
<<<<<<< HEAD
        require: true
=======
        required: true
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
<<<<<<< HEAD
contactUsSchema.plugin(timeZone, { paths: ["createdAt"] });
const ContactUs = mongoose.model("ContactUs", contactUsSchema);

=======
contactSchema.plugin(timeZone, { paths: ["createdAt"] });
const ContactUs = mongoose.model("ContactUs", contactSchema);
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
/**
 * validation for contact form.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
<<<<<<< HEAD
 * @param	mixed	ContactUs	
 * @return	mixed
 */

=======
 * @param	mixed	User	
 * @return	mixed
 */
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
function validationForContactForm(ContactUs) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        subject: Joi.string().required(),
<<<<<<< HEAD
        message: Joi.string().required(),
        ip: Joi.string().min(1).required(),
        ip2: Joi.string().min(1).required()
=======
        message: Joi.string().required()
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
    };

    return Joi.validate(ContactUs, schema);
}
<<<<<<< HEAD
module.exports = { validationForContactForm, ContactUs };
=======
module.exports = { ContactUs,validationForContactForm };
>>>>>>> f48a8a95613c4662328a0fc4ef9c8bb1da6bbafd
