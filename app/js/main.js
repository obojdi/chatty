function $(a) {
	return document.getElementById(a)
}
document.getElementsByClassName('navbar-brand')[0].innerHTML = 'horsecock chat'.toUpperCase()


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