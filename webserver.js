var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io','net')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED6 = new Gpio(6, 'out'); //use GPIO pin 6 as output
var LED13 = new Gpio(13, 'out'); //use GPIO pin 13 as output
var LED22 = new Gpio(22, 'out'); //use GPIO pin 22 as output
var LED27 = new Gpio(27, 'out'); //use GPIO pin 27 as output


var GPIO6value = 1;  // Turn on the LED by default
var GPIO13value = 1;  // Turn on the LED by default
var GPIO22value = 1;  // Turn on the LED by default
var GPIO27value = 1;  // Turn on the LED by default

/****** CONSTANTS******************************************************/

const WebPort = 80;


/* if you want to run WebPort on a port lower than 1024 without running
 * node as root, you need to run following from a terminal on the pi
 * sudo apt update
 * sudo apt install libcap2-bin
 * sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
 */
 
/*************** Web Browser Communication ****************************/



// Start http webserver
http.listen(WebPort, function() {  // This gets call when the web server is first started.
	LED6.writeSync(GPIO6value); //turn LED on or off
	LED13.writeSync(GPIO13value); //turn LED on or off
	LED22.writeSync(GPIO22value); //turn LED on or off
	LED27.writeSync(GPIO27value); //turn LED on or off
	
	console.log('Server running on Port '+WebPort);
	console.log('GPIO6 = '+GPIO6value);
	console.log('GPIO13 = '+GPIO13value);
	console.log('GPIO22 = '+GPIO22value);
	console.log('GPIO27 = '+GPIO27value);
	} 
); 



// function handler is called whenever a client makes an http request to the server
// such as requesting a web page.
function handler (req, res) { 
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log('filename='+filename);
    var extname = path.extname(filename);
    if (filename=='./') {
      console.log('retrieving default index.html file');
      filename= './index.html';
    }
    
    // Initial content type
    var contentType = 'text/html';
    
    // Check ext and set content type
    switch(extname) {
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
    

    
    fs.readFile(__dirname + '/public/' + filename, function(err, content) {
	if(err) {
	    console.log('File not found. Filename='+filename);
	    fs.readFile(__dirname + '/public/404.html', function(err, content) {
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		return res.end(content,'utf8'); //display 404 on error
	    });
	}
	else {
	    // Success
	    res.writeHead(200, {'Content-Type': contentType}); 
	    return res.end(content,'utf8');
	}
      
    });
}


// Execute this when web server is terminated
process.on('SIGINT', function () { //on ctrl+c
  LED6.writeSync(0); // Turn LED off
  LED6.unexport(); // Unexport LED GPIO to free resources
  
  LED13.writeSync(0); // Turn LED off
  LED13.unexport(); // Unexport LED GPIO to free resources
  
  LED22.writeSync(0); // Turn LED off
  LED22.unexport(); // Unexport LED GPIO to free resources
  
  LED27.writeSync(0); // Turn LED off
  LED27.unexport(); // Unexport LED GPIO to free resources

  process.exit(); //exit completely
}); 


/****** io.socket is the websocket connection to the client's browser********/

io.sockets.on('connection', function (socket) {// WebSocket Connection
    console.log('A new client has connectioned. Send LED status');
    socket.emit('GPIO6', GPIO6value);
    socket.emit('GPIO13', GPIO13value);
    socket.emit('GPIO22', GPIO22value);
    socket.emit('GPIO27', GPIO27value);
    
    // this gets called whenever client presses GPIO6 toggle light button
    socket.on('GPIO6T', function(data) { 
	if (GPIO6value) GPIO6value = 0;
	else GPIO6value = 1;
	console.log('new GPIO6 value='+GPIO6value);
	LED6.writeSync(GPIO6value); //turn LED on or off
	console.log('Send new GPIO6 state to ALL clients');
	io.emit('GPIO6', GPIO6value); //send button status to ALL clients 
    });
    
    // this gets called whenever client presses GPIO13 toggle light button
    socket.on('GPIO13T', function(data) { 
	if (GPIO13value) GPIO13value = 0;
	else GPIO13value = 1;
	console.log('new GPIO13 value='+GPIO13value);
	LED13.writeSync(GPIO13value); //turn LED on or off
	console.log('Send new GPIO13 state to ALL clients');
	io.emit('GPIO13', GPIO13value); //send button status to ALL clients 
    });
    
    // this gets called whenever client presses GPIO22 toggle light button
    socket.on('GPIO22T', function(data) { 
	if (GPIO22value) GPIO22value = 0;
	else GPIO22value = 1;
	console.log('new GPIO22 value='+GPIO22value);
	LED22.writeSync(GPIO22value); //turn LED on or off
	console.log('Send new GPIO22 state to ALL clients');
	io.emit('GPIO22', GPIO22value); //send button status to ALL clients 	
    });
    
    // this gets called whenever client presses GPIO27 toggle light button
    socket.on('GPIO27T', function(data) { 
	if (GPIO27value) GPIO27value = 0;
	else GPIO27value = 1;
	console.log('new GPIO27 value='+GPIO27value);
	LED27.writeSync(GPIO27value); //turn LED on or off
	console.log('Send new GPIO27 state to ALL clients');
	io.emit('GPIO27', GPIO27value); //send button status to ALL clients 	
    });

    
    // this gets called whenever client presses GPIO6 momentary light button
    socket.on('GPIO6', function(data) { 
	GPIO6value = data;
	if (GPIO6value != LED6.readSync()) { //only change LED if status has changed
	    LED6.writeSync(GPIO6value); //turn LED on or off
	    console.log('Send new GPIO6 state to ALL clients');
	    io.emit('GPIO6', GPIO6value); //send button status to ALL clients 
	};	
    });
    
    // this gets called whenever client presses GPIO13 momentary light button
    socket.on('GPIO13', function(data) { 
	GPIO13value = data;
	if (GPIO13value != LED13.readSync()) { //only change LED if status has changed
	    LED13.writeSync(GPIO13value); //turn LED on or off
	    console.log('Send new GPIO13 state to ALL clients');
	    io.emit('GPIO13', GPIO13value); //send button status to ALL clients 
	};

    });
    
    // this gets called whenever client presses GPIO22 momentary light button
    socket.on('GPIO22', function(data) { 
	GPIO22value = data;
	if (GPIO22value != LED22.readSync()) { //only change LED if status has changed
	    LED22.writeSync(GPIO22value); //turn LED on or off
	    console.log('Send new GPIO22 state to ALL clients');
	    io.emit('GPIO22', GPIO22value); //send button status to ALL clients e
	};

    });
    
    // this gets called whenever client presses GPIO27 momentary light button
    socket.on('GPIO27', function(data) { 
	GPIO27value = data;
	if (GPIO27value != LED27.readSync()) { //only change LED if status has changed
	    LED27.writeSync(GPIO27value); //turn LED on or off
	    console.log('Send new GPIO27 state to ALL clients');
	    io.emit('GPIO27', GPIO27value); //send button status to ALL clients 
	};
	
    });
 
 

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
	console.log('A user disconnected');
    });
    

}); 