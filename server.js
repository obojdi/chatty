var server = require('http').createServer(),
	url = require('url'),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({
		server: server
	}),
	express = require('express'),
	app = express(),
	port = 4080,
	users = [],
	messages = [],
	active_users = [];
app.use(function(req, res) {
	//res.send({
	//	msg: "hello"
	//});
});
wss.on('connection', function connection(ws) {
	var id = Math.ceil(Math.random() * 1000)


	console.log(id)
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		message = JSON.parse(message)
		switch (message.type) {
			case 'auth':
				user = message
				var pos = users.map(function(i) {
					return i.user.login
				}).indexOf(user.login)
				console.log(user.login)
				console.log(pos)
				if (pos < 0) {
					//not found,add user
					users.push({id:id,user:user})
					console.log('id')
					console.log(id)
					// users[id] = user;

					active_users.push(user);
					ws.send(JSON.stringify({
						type: 'auth',
						result: true
					}));
					ws.send(JSON.stringify({
						type: 'userlist',
						users: users
					}));
					ws.send(JSON.stringify({
						type: 'history',
						list: messages
					}));

					ws.send(JSON.stringify({
						type: 'log',
						body: 'connected user ' + user.login
					}));
				} else {
					//found, return false
					ws.send(JSON.stringify({
						type: 'auth',
						result: false,
						reason: 'exists'
					}));
				}
				break;
			case 'message':
				messages.push(message)
				ws.send(JSON.stringify({
					type: 'message',
					body: message.body
				}))
				break;
			case 'log':
				ws.send(JSON.stringify({
					type: 'message',
					body: message.body
				}))
				break;
		}
	});
	ws.send(JSON.stringify({
		type: 'log',
		body: 'connected user'
	}));
	ws.on('close', function() {
		// ws.send(JSON.stringify({
			// type: 'log',
			// body: 'disconnected user ' + users[id].login
		// }));
		delete users[id]
	});
});


wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		// client.send(data);
	});
};
server.on('request', app);
server.listen(port, function() {
	console.log('Listening on ' + server.address().port)
});