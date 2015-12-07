function $(a) {
	return document.getElementById(a)
}
document.getElementsByClassName('navbar-brand')[0].innerHTML = 'chatty chat'.toUpperCase()


// var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:4080');

ws.onopen = function open() {
	ws.send(JSON.stringify({
		type: 'log',
		body: 'client connection open'
	}));


};

ws.onmessage = function(event) {
	console.log('message INCOMING')
	response = document.getElementsByClassName('response')[0]
	var message = JSON.parse(event.data)
	console.log(message)
	switch (message.type) {
		case 'auth':
			if (message.result == false) {
				if (message.reason == 'exists') {
					response.innerHTML = 'user exists'
				} else if (message.reason == 'wrong') {
					response.innerHTML = 'wrong password'

				}
			} else if (message.result == true) {
				document.getElementsByClassName('modal')[0].style.display = "none"

			}
			break;
		case 'message':
		case 'log':

			var date = new Date();

			datevalues = {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: (parseInt(date.getDate()) < 10 ? '0' + date.getDate() : date.getDate()),
				hour: date.getHours(),
				min: date.getMinutes(),
				sec: date.getSeconds(),
			};
			var now = datevalues.hour + ':' + datevalues.min + ':' + datevalues.sec + ' ' + datevalues.day + '.' + datevalues.month + '.' + datevalues.year

			var timestamp = document.createElement('span');

			timestamp.className = "timestamp";
			timestamp.innerHTML = now;

			var msg = document.createElement('div');
			msg.className = "message new-message";
			msg.innerHTML = message.body;
			msg.appendChild(timestamp);
			// + ' ' + timestamp;
			$('chat').appendChild(msg)
			break;
		case 'userlist':
			aside = document.getElementsByClassName('users')[0]
			aside.innerHTML = '';
			// console.log('users')
			// console.log(message)
			users = message.users
			for (var a in users) {
				var rnd = Math.floor(Math.random() * 10) + 100
				var kitteh = document.createElement('img');
				kitteh.src = 'http://placekitten.com/' + rnd + '/' + rnd
				var user = document.createElement('span');
				user.className = "user";
				user.appendChild(kitteh)


				user.innerHTML = user.innerHTML + users[a].login;
				aside.appendChild(user)
			}
			break;
		case 'history':
			chat = $('chat')
			chat.innerHTML = '';
			console.log('history')
			console.log(message.list)
			for (var a in message.list) {

			console.log(a)
				console.log(message.list[a])


				var date = new Date();

				datevalues = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					day: (parseInt(date.getDate()) < 10 ? '0' + date.getDate() : date.getDate()),
					hour: date.getHours(),
					min: date.getMinutes(),
					sec: date.getSeconds(),
				};
				var now = datevalues.hour + ':' + datevalues.min + ':' + datevalues.sec + ' ' + datevalues.day + '.' + datevalues.month + '.' + datevalues.year

				var timestamp = document.createElement('span');

				timestamp.className = "timestamp";
				timestamp.innerHTML = now;

				var msg = document.createElement('div');
				msg.className = "message new-message";
				msg.innerHTML = message.list[a].body;
				msg.appendChild(timestamp);
				// + ' ' + timestamp;
				chat.appendChild(msg)
			}
			break;
	}
	// ws.send(event.data)
};
$('message').addEventListener('keypress', function(event) {
	if (event.which == 13) {
		// $('form').submit()
		console.log(this.value)
		ws.send(JSON.stringify({
			type: 'message',
			body: this.value
		}));
		this.value = ' '.trim()
	}
})
$('form').addEventListener('submit', function(event) {
	event.preventDefault()
	var input = event.target.getElementsByTagName('textarea')[0];
	var text = input.value;
	console.log(text)
	ws.send(JSON.stringify({
		type: 'message',
		body: text
	}));
	input.value = ''
		// return false;
})


document.getElementsByClassName('modal')[0].style.display = "block"

$('auth').addEventListener('submit', function(event) {
	event.preventDefault()

	var input = event.target.getElementsByClassName('login')[0];

	var login = input.value;

	input = event.target.getElementsByClassName('password')[0];

	var password = input.value;
	var json = JSON.stringify({
		type: 'auth',
		login: login,
		pass: password
	})
	console.log(json)
	ws.send(json);

	input.value = ''
});