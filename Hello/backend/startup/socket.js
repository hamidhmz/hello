const { User, validateUser } = require('../models/user');
const { Chat, validate } = require('../models/Chat');
const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { logger } = require('./logging');


let messageDetails = {};
let onlineUsers = {};
module.exports = function (app) {
    const server = require('http').Server(app);
    let io;
    io = require('socket.io')(server, {
        path: '/hello/socket'
    });

    io.on('connection', function (socket) {
        let senderEmail;
        let receiverEmail;
        let senderToken;

        socket.on('a user is online', async function (token) {
            const user = await giveMeUserInformation(token);
            socket.email = user.email;
            onlineUsers[socket.email] = user;
            io.emit('online users', Object.keys(onlineUsers));
            User.find().select('-__v -password').exec(function (err, docs) {

                const oo = [];
                docs.forEach(function (element, i) {
                    let shElement = {};
                    shElement.name = element.name;
                    shElement.email = element.email;
                    shElement.profileImage = element.profileImage;
                    shElement._id = element._id;
                    shElement.isOnline = true;
                    oo.push(shElement);
                });
                for (let i = 0; i < oo.length; i++) {
                    let finder = 0;
                    for (let j = 0; j < Object.keys(onlineUsers).length; j++) {
                        if (oo[i].email === Object.keys(onlineUsers)[j]) {
                            finder = 1;
                        }
                    }
                    if (finder === 0) {

                        oo[i].isOnline = false;
                    }
                }
                io.emit('load all users', oo);
            });
        });
        socket.on('senderToken', async function (data) {
            // const user = await giveMeUserInformation(data);
            // senderToken = data;
            const user1 = jwt.verify(data, config.get('jwtPrivateKey'));

            const user = await User.findById(user1._id).select('-password');
            senderEmail = user.email;
            socket.emit('get sender email', senderEmail);
        });
        socket.on('receiverEmail', function (data) {
            receiverEmail = data;
        });
        socket.on('disconnect', function () {
            delete onlineUsers[socket.email];
            io.emit('online users', Object.keys(onlineUsers));
            User.find().select('-__v -password').exec(function (err, docs) {

                const oo = [];
                docs.forEach(function (element, i) {
                    let shElement = {};
                    shElement.name = element.name;
                    shElement.email = element.email;
                    shElement.profileImage = element.profileImage;
                    shElement._id = element._id;
                    shElement.isOnline = true;
                    oo.push(shElement);
                });

                for (let i = 0; i < oo.length; i++) {
                    let finder = 0;
                    for (let j = 0; j < Object.keys(onlineUsers).length; j++) {
                        if (oo[i].email === Object.keys(onlineUsers)[j]) {
                            finder = 1;
                        }
                    }
                    if (finder === 0) {

                        oo[i].isOnline = false;
                    }
                }
                io.emit('load all users', oo);
            });
        });

        socket.on('onclickPerson', function () {
            Chat.find().or([{ senderEmail: senderEmail, receiverEmail: receiverEmail }, { senderEmail: receiverEmail, receiverEmail: senderEmail }]).exec(function (err, docs) {
                if (err) throw err;
                for (let i = 0; i < docs.length; i++) {
                    docs[i].createdAt = docs[i].createdAt.getTime() + 270 * 60000;
                }
                io.emit('load old messages', docs);
            });
        });
        socket.on('createId', function () {
            const _id = mongoose.Types.ObjectId();
            const chat = new Chat({ _id });
            chat.save(function (err) {
                if (err) {
                    logger.error(err);
                }
            });
            socket.emit('idCreated', _id); // it must just send to one user
        });
        socket.on('send message', async function (data) {
            data['senderEmail'] = senderEmail;
            data['receiverEmail'] = receiverEmail;
            const { error } = validate(data);
            if (error) return 1;
            let senderUser = await User.findOne({ email: senderEmail });
            if (!senderUser) socket.on('error', 'this is false for sender user');

            let receiverUser = await User.findOne({ email: receiverEmail });
            if (!receiverUser) socket.on('error', 'this is false for receiver user');
            const chat = new Chat(_.pick(data, ['senderEmail', 'receiverEmail', 'content', '_id']));
            console.log(data.senderEmail, data._id);
            chat.save(function (err) {
                if (err) logger.error(err);
                io.emit('message has been sent', messageDetails);
                Chat.find().or([{ senderEmail: senderEmail, receiverEmail: receiverEmail }, { senderEmail: receiverEmail, receiverEmail: senderEmail }]).exec(function (err, docs) {
                    if (err) throw err;
                    for (let i = 0; i < docs.length; i++) {
                        docs[i].createdAt = docs[i].createdAt.getTime() + 270 * 60000;
                        // docs[i].date = docs[i].createdAt.getFullYear() + "/" + docs[i].createdAt.getMonth() + "/" + docs[i].createdAt.getDay() + "   " + docs[i].createdAt.getHours() + ":" + docs[i].createdAt.getMinutes() + ":" + docs[i].createdAt.getSeconds();
                    }
                    io.emit('load old messages', docs);
                });
            });
            // socket.broadcast.emit("new message",data);

        });
        async function giveMeUserInformation(token) {
            senderToken = jwt.verify(token, config.get('jwtPrivateKey'));
            return await User.findById(senderToken._id).select('-password');
        }
    });

    return server;
};

