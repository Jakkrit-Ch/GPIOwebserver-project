var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io', 'net')(http) //require socket.io module and pass the http object (server)

var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO
var LED6 = new Gpio(6, {mode: Gpio.OUTPUT}); //use GPIO pin 6 as output
var LED13 = new Gpio(13, {mode: Gpio.OUTPUT}); //use GPIO pin 13 as output
var LED22 = new Gpio(22, {mode: Gpio.OUTPUT}); //use GPIO pin 22 as output
var LED27 = new Gpio(27, {mode: Gpio.OUTPUT}); //use GPIO pin 27 as output
var sensorLib = require("node-dht-sensor");

// var PWMGpio = require('pigpio').Gpio;
// var PWM6 = new PWMGpio(6, {mode: PWMGpio.OUTPUT});

var GPIO6value = 0;  // Turn on the LED by default
var GPIO13value = 0;  // Turn on the LED by default
var GPIO22value = 0;  // Turn on the LED by default
var GPIO27value = 0;  // Turn on the LED by default

var PWM6value = 100;
var PWM13value = 100;
var PWM22value = 100;
var PWM27value = 100;


/****** CONSTANTS******************************************************/

const WebPort = 80;

/* if you want to run WebPort on a port lower than 1024 without running
 * node as root, you need to run following from a terminal on the pi
 * sudo apt update
 * sudo apt install libcap2-bin
 * sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
 */

/*************** Web Browser Communication ****************************/

/* if you want to run WebPort on a port lower than 1024 without running
 * node as root, you need to run following from a terminal on the pi
 * sudo apt update
 * sudo apt install libcap2-bin
 * sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
 */

/*************** Web Browser Communication ****************************/


// Start http webserver
http.listen(WebPort, function () {  // This gets call when the web server is first started.
	LED6.digitalWrite(GPIO6value); //turn LED on or off
	LED13.digitalWrite(GPIO13value); //turn LED on or off
	LED22.digitalWrite(GPIO22value); //turn LED on or off
	LED27.digitalWrite(GPIO27value); //turn LED on or off
	console.log('Server running on Port ' + WebPort);
	console.log('GPIO6 = ' + GPIO6value);
	console.log('GPIO13 = ' + GPIO13value);
	console.log('GPIO22 = ' + GPIO22value);
	console.log('GPIO27 = ' + GPIO27value);
});

// function handler is called whenever a client makes an http request to the server
// such as requesting a web page.

function handler(req, res) {
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	var extname = path.extname(filename);
	if (filename == './') {
		filename = './index.html';
	}

	// Initial content type
	var contentType = 'text/html';

	// Check ext and set content type
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.json':
			contentType = 'application/json';
			break;
		case '.png':
			contentType = 'image/png';
			break;
		case '.jpg':
			contentType = 'image/jpg';
			break;
		case '.ico':
			contentType = 'image/png';
			break;
	}

	fs.readFile(__dirname + '/public/' + filename, function (err, content) {
		if (err) {
			fs.readFile(__dirname + '/public/404.html', function (err, content) {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				return res.end(content, 'utf8'); //display 404 on error
			});
		}
		else {
			// Success
			res.writeHead(200, { 'Content-Type': contentType });
			return res.end(content, 'utf8');
		}
	});
}

// Execute this when web server is terminated
process.on('SIGINT', function () { //on ctrl+c
	LED6.digitalWrite(0); // Turn LED off
	LED13.digitalWrite(0); // Turn LED off
	LED22.digitalWrite(0); // Turn LED off
	LED27.digitalWrite(0); // Turn LED off
	process.exit(); //exit completely
});

/****** io.socket is the websocket connection to the client's browser********/

io.sockets.on('connection', function (socket) {// WebSocket Connection
	console.log('A new client has connectioned. Send LED status');
	socket.emit('GPIO6', GPIO6value);
	socket.emit('GPIO13', GPIO13value);
	socket.emit('GPIO22', GPIO22value);
	socket.emit('GPIO27', GPIO27value);
	// DHT22 sensor
	var dht22 = {
		sensors: [
			{
				name: "Room A15",
				type: 22,
				pin: 10
			}
		],
		read: function () {
			for (var sensor in this.sensors) {
				var readout = sensorLib.read(
					this.sensors[sensor].type,
					this.sensors[sensor].pin
				);
				var temp = readout.temperature.toFixed(1)
				var hum = readout.humidity.toFixed(1)
				
				console.log(
					`[${this.sensors[sensor].name}] ` +
					`temperature: ${temp}°C, ` +
					`humidity: ${hum}%`
				);
				socket.temp = readout.temperature.toFixed(1)
				socket.hum = readout.humidity.toFixed(1)
				socket.emit('change_value', {
					temp: socket.temp,
					hum: socket.hum
				})
			}
			setTimeout(function () {
				dht22.read();
			}, 5000);
		}
	};
	dht22.read();

	// PWM GPIO
	socket.emit("PWM6T", PWM6value)
	socket.emit("PWM13T", PWM13value)
	socket.emit("PWM22T", PWM22value)
	socket.emit("PWM27T", PWM27value)


	socket.on('PWM6', function (data) {
		console.log(data);
		LED6.pwmWrite(parseInt(255-(data*2.55)));
		if (PWM6value) PWM6value = data;
		else PWM6value = 0;
		io.emit('PWM6');
	})

	socket.on('PWM13', function (data) {
		console.log(data);
		LED13.pwmWrite(parseInt(255-(data*2.55)));
		if (PWM13value) PWM13value = data;
		else PWM13value = 0;
	})

	socket.on('PWM22', function (data) {
		console.log(data);
		LED22.pwmWrite(parseInt(255-(data*2.55)));
		if (PWM22value) PWM22value = data;
		else PWM22value = 0;
	})

	socket.on('PWM27', function (data) {
		console.log(data);
		LED27.pwmWrite(parseInt(255-(data*2.55)));
		if (PWM27value) PWM27value = data;
		else PWM27value = 0;
	})


	// this gets called whenever client presses GPIO6 toggle light button
	socket.on('GPIO6T', function (data) {
		io.emit('GPIO6', GPIO6value); //send button status to ALL clients 
		if (GPIO6value) {
			GPIO6value = 0;
			PWM6value = 100;
			io.emit("PWM6T", PWM6value);
		}
		else {
			GPIO6value = 1;
			PWM6value = 0;
			io.emit("PWM6T", PWM6value);
		}
		console.log('GPIO6 value=' + GPIO6value);
		LED6.digitalWrite(GPIO6value); //turn LED on or off
	});

	// this gets called whenever client presses GPIO13 toggle light button
	socket.on('GPIO13T', function (data) {
		io.emit('GPIO13', GPIO13value); //send button status to ALL clients 
		if (GPIO13value) {
			GPIO13value = 0;
			PWM13value = 100;
			io.emit("PWM13T", PWM13value);
		}
		else {
			GPIO13value = 1;
			PWM13value = 0;
			io.emit("PWM13T", PWM13value);
		}
		console.log('GPIO13 value=' + GPIO13value);
		LED13.digitalWrite(GPIO13value); //turn LED on or off
	});

	// this gets called whenever client presses GPIO22 toggle light button
	socket.on('GPIO22T', function (data) {
		io.emit('GPIO22', GPIO22value); //send button status to ALL clients 	
		if (GPIO22value) {
			GPIO22value = 0;
			PWM22value = 100;
			io.emit("PWM22T", PWM22value);
		}
		else {
			GPIO22value = 1;
			PWM22value = 0;
			io.emit("PWM22T", PWM22value);
		}
		console.log('GPIO22 value=' + GPIO22value);
		LED22.digitalWrite(GPIO22value); //turn LED on or off
	});

	// this gets called whenever client presses GPIO27 toggle light button
	socket.on('GPIO27T', function (data) {
		io.emit('GPIO27', GPIO27value); //send button status to ALL clients
		if (GPIO27value) {
			GPIO27value = 0;
			PWM27value = 100;
			io.emit('PWM27T', PWM27value);
		} else {
			GPIO27value = 1;
			PWM27value = 0;
			io.emit('PWM27T', PWM27value);
		}
		console.log('GPIO27 value=' + GPIO27value);
		LED27.digitalWrite(GPIO27value); //turn LED on or off
	});

	//Whenever someone disconnects this piece of code executed
	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});
