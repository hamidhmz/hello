import mongoose from "mongoose";
import Joi from "joi";
import joi_objectid from "joi-objectid";
import timeZone from "mongoose-timezone";

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

export {validate,Chat};