const mongoose = require("mongoose");
const Joi = require("joi");
const joi_objectid = require("joi-objectid");
const timeZone = require("mongoose-timezone");

Joi.objectId = joi_objectid(Joi);
const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    subject: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    ip2: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
contactUsSchema.plugin(timeZone, { paths: ["createdAt"] });
const ContactUs = mongoose.model("ContactUs", contactUsSchema);

/**
 * validation for contact form.
 *
 * @author	hamidreza nasrollahi
 * @since	v0.0.1
 * @version	v1.0.0	Wednesday, November 13th, 2019.
 * @global
 * @param	mixed	ContactUs	
 * @return	mixed
 */

function validationForContactForm(ContactUs) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(50).required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        ip: Joi.string().min(1).required(),
        ip2: Joi.string().min(1).required()
    };

    return Joi.validate(ContactUs, schema);
}
module.exports = { validationForContactForm, ContactUs };