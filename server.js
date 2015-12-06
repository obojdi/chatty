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

	// console.log('ws')
	// console.log(ws)
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		message = JSON.parse(message)
		switch (message.type) {
			case 'auth':
				user = message
				for (var a in users) {
					if (users[a].login == user.login) {
						ws.send(JSON.stringify({
							type: 'auth',
							result: false,
							reason: 'exists'
						}));
						break;
					}
				}
				var pos = users.map(function(i) {
					return i.login
				}).indexOf(user.login)
				if (pos < 0) {
					//not found,add user
					users.push(user);
					ws.send(JSON.stringify({
						type: 'auth',
						result: true
					}));
					break;
				} else {
					//found, check password
					if (users[pos].pass == user.pass) {
						users.push(user);
						ws.send(JSON.stringify({
							type: 'auth',
							result: true
						}));
						ws.send(JSON.stringify({
							type: 'log',
							body: 'user' + user.login + ' connected'
						}));
						break;
					} else {
						ws.send(JSON.stringify({
							type: 'auth',
							result: false,
							reason: 'wrong'
						}));
						break;
					}
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