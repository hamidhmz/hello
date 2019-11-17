const express = require('express');
const app = express();
const port = 3000;

const server = require("http").Server(app);
let io = require('socket.io')(server);
app.set("view engine", "ejs");
app.set("views", "./");
app.use(express.static(__dirname ));
function connection(socket) {
	var channel_id;

	function disconnect() {
		console.log("disconnected");

		if (channel_id && channels[channel_id]) {
			for (var i=0; i<channels[channel_id].sockets.length; i++) {
				if (socket !== channels[channel_id].sockets[i]) {
					channels[channel_id].sockets[i].emit("disconnect");
				}
				channels[channel_id].sockets[i].leave("channel:" + channel_id);
				channels[channel_id].sockets[i] = null;
			}
			channels[channel_id] = null;
			channel_id = null;
		}
	}

	function onSignal(msg) {
		console.log("relaying signal:",msg);
		socket.broadcast.emit("signal",msg);
	}

	socket.on("disconnect",disconnect);
	socket.on("signal",onSignal);

	// is there a channel waiting for a socket to join it?
	if (
		channels.length > 0 &&
		channels[channels.length-1] &&
		channels[channels.length-1].sockets.length === 1
	) {
		console.log("sockets joining channel: " + (channels.length-1));

		channels[channels.length-1].sockets.push(socket);

		// join both sockets to the channel
		for (var i=0; i<2; i++) {
			channels[channels.length-1].sockets[i].join("channel:" + channel_id);
		}

		// identify caller and receiver
		channels[channels.length-1].sockets[0].emit("identify",/*caller=*/true);
		channels[channels.length-1].sockets[1].emit("identify",/*caller=*/false);
	}
  
	// make a new channel
	else {
		channels[channels.length] = {
			sockets: [socket]
		};
	}

	// save this socket's channel_id
	channel_id = channels.length - 1;

	console.log("user assigned to channel: " + channel_id);
}


// app.get('/', (req, res) => {
// 	res.render("11", { page: "video-call" });
// });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

io.of("/rtc").on("connection",connection);