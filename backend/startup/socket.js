import {User, validateUser} from "../models/user";
import {Chat,validate} from "../models/Chat";
import _ from "lodash";
import config from "config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

let senderEmail;
let receiverEmail;
let senderToken;
let messageDetails = {};
export default function(app){
    const server = require("http").createServer(app);
    let io;
    io = require('socket.io')(server);
    io.on('connection', function(socket){
        socket.on('senderToken', async function(data){
            senderToken = jwt.verify(data,config.get("jwtPrivateKey"));
            const user = await User.findById(senderToken._id).select("-password");
            senderEmail = user.email;
            socket.emit("get sender email",senderEmail);
        });
        socket.on('receiverEmail', function(data){
            receiverEmail = data;
        });
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        User.find().select("-password").exec(function(err,docs){
            if(err) throw err;
            socket.emit("load all users",docs);
        });
        socket.on("onclickPerson",function () {
            Chat.find().or([{ senderEmail: senderEmail,receiverEmail:receiverEmail },{ senderEmail: receiverEmail,receiverEmail:senderEmail }]).exec(function(err,docs){
                if(err) throw err;
                for (let i = 0; i < docs.length; i++) {
                    docs[i].createdAt = docs[i].createdAt.getTime() + 270*60000;
                }
                socket.emit("load old messages",docs);
            });
        });
        socket.on("createId",function () {
            const _id = mongoose.Types.ObjectId();
            socket.emit("idCreated",_id);
        });
        socket.on("send message",async function(data){
            data["senderEmail"] = senderEmail;
            data["receiverEmail"] = receiverEmail;
            const { error } = validate(data);
            // if (error) return socket.on("error",error.details[0].message);
            if (error) return console.log(error);
            let senderUser = await User.findOne({email:senderEmail});
            if(!senderUser) socket.on("error","this is false for sender user");

            let receiverUser = await User.findOne({email:receiverEmail});
            if(!receiverUser) socket.on("error","this is false for receiver user");
            const chat = new Chat(_.pick(data,["senderEmail","receiverEmail","content","_id"]));
            // io.emit("new message",data);
            chat.save(function (err) {
                if (err) console.log(err);
                socket.emit("message has been sent",messageDetails);
                Chat.find().or([{ senderEmail: senderEmail,receiverEmail:receiverEmail },{ senderEmail: receiverEmail,receiverEmail:senderEmail }]).exec(function(err,docs){
                    if(err) throw err;
                    for (let i = 0; i < docs.length; i++) {
                        docs[i].createdAt = docs[i].createdAt.getTime() + 270*60000;
                        // docs[i].date = docs[i].createdAt.getFullYear() + "/" + docs[i].createdAt.getMonth() + "/" + docs[i].createdAt.getDay() + "   " + docs[i].createdAt.getHours() + ":" + docs[i].createdAt.getMinutes() + ":" + docs[i].createdAt.getSeconds();
                    }
                    socket.emit("load old messages",docs);
                });
            });
            // socket.broadcast.emit("new message",data);

        });
    });

    return server;
}

