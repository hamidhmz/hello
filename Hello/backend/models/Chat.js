const mongoose = require('mongoose');
const Joi = require('joi');
const joi_objectid = require('joi-objectid');
const timeZone = require('mongoose-timezone');

Joi.objectId = joi_objectid(Joi);
const chatSchema = new mongoose.Schema({
    senderEmail: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    receiverEmail: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
    },
    isSeen:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});
chatSchema.plugin(timeZone, { paths: ['createdAt'] });
const Chat = mongoose.model('Chat', chatSchema);
function validate(Chat) {
    const schema = {
        _id: Joi.objectId().required(),
        senderEmail: Joi.string().email().min(4).max(50).required(),
        receiverEmail: Joi.string().email().min(4).max(50).required(),
        content: Joi.string().min(1).required()
    };

    return Joi.validate(Chat, schema);
}

module.exports =  {validate, Chat};