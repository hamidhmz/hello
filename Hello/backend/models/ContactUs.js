/* eslint-disable linebreak-style */
const mongoose = require("mongoose");
const Joi = require("joi");
const joi_objectid = require("joi-objectid");
const timeZone = require("mongoose-timezone");

Joi.objectId = joi_objectid(Joi);
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    subject: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
    },
    ip: {
        type: String,
        required: true
    },
    ip2: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
contactSchema.plugin(timeZone, { paths: ["createdAt"] });
const ContactUs = mongoose.model("ContactUs", contactSchema);
// function validate(ContactUs) {
//     const schema = {
//     };

//     return Joi.validate(Chat, schema);
// }

module.exports = { ContactUs };