var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var url = require('url');
var path = require('path');
var io = require('socket.io','net')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED31 = new Gpio(31, 'out'); //use GPIO pin 31 as output
var LED33 = new Gpio(33, 'out'); //use GPIO pin 33 as output
var LED15 = new Gpio(15, 'out'); //use GPIO pin 15 as output
var LED13 = new Gpio(13, 'out'); //use GPIO pin 13 as output


var GPIO31value = 0;  // Turn on the LED by default
var GPIO33value = 0;  // Turn on the LED by default
var GPIO15value = 1;  // Turn on the LED by default
var GPIO13value = 1;  // Turn on the LED by default

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
	LED31.writeSync(GPIO31value); //turn LED on or off
	LED33.writeSync(GPIO33value); //turn LED on or off
	LED15.writeSync(GPIO15value); //turn LED on or off
	LED13.writeSync(GPIO13value); //turn LED on or off
	console.log('Server running on Port '+WebPort);
	console.log('GPIO31 = '+GPIO31value);
	console.log('GPIO33 = '+GPIO33value);
	console.log('GPIO15 = '+GPIO15value);
	console.log('GPIO13 = '+GPIO13value);
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
  LED31.writeSync(0); // Turn LED off
  LED31.unexport(); // Unexport LED GPIO to free resources
  
  LED33.writeSync(0); // Turn LED off
  LED33.unexport(); // Unexport LED GPIO to free resources
  
  LED15.writeSync(0); // Turn LED off
  LED15.unexport(); // Unexport LED GPIO to free resources
  
  LED13.writeSync(0); // Turn LED off
  LED13.unexport(); // Unexport LED GPIO to free resources

  process.exit(); //exit completely
}); 


/****** io.socket is the websocket connection to the client's browser********/

io.sockets.on('connection', function (socket) {// WebSocket Connection
    console.log('A new client has connectioned. Send LED status');
    socket.emit('GPIO31', GPIO31value);
    socket.emit('GPIO33', GPIO33value);
    socket.emit('GPIO15', GPIO15value);
    socket.emit('GPIO13', GPIO13value);
    
    // this gets called whenever client presses GPIO31 toggle light button
    socket.on('GPIO31T', function(data) { 
	if (GPIO31value) GPIO31value = 0;
	else GPIO31value = 1;
	console.log('new GPIO31 value='+GPIO31value);
	LED31.writeSync(GPIO31value); //turn LED on or off
	console.log('Send new GPIO31 state to ALL clients');
	io.emit('GPIO31', GPIO31value); //send button status to ALL clients 
    });
    
    // this gets called whenever client presses GPIO33 toggle light button
    socket.on('GPIO33T', function(data) { 
	if (GPIO33value) GPIO33value = 0;
	else GPIO33value = 1;
	console.log('new GPIO33 value='+GPIO33value);
	LED33.writeSync(GPIO33value); //turn LED on or off
	console.log('Send new GPIO33 state to ALL clients');
	io.emit('GPIO33', GPIO33value); //send button status to ALL clients 
    });
    
    // this gets called whenever client presses GPIO15 toggle light button
    socket.on('GPIO15T', function(data) { 
	if (GPIO15value) GPIO15value = 0;
	else GPIO15value = 1;
	console.log('new GPIO15 value='+GPIO15value);
	LED15.writeSync(GPIO15value); //turn LED on or off
	console.log('Send new GPIO15 state to ALL clients');
	io.emit('GPIO15', GPIO15value); //send button status to ALL clients 	
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

    
    // this gets called whenever client presses GPIO31 momentary light button
    socket.on('GPIO31', function(data) { 
	GPIO31value = data;
	if (GPIO31value != LED31.readSync()) { //only change LED if status has changed
	    LED31.writeSync(GPIO31value); //turn LED on or off
	    console.log('Send new GPIO31 state to ALL clients');
	    io.emit('GPIO31', GPIO31value); //send button status to ALL clients 
	};	
    });
    
    // this gets called whenever client presses GPIO33 momentary light button
    socket.on('GPIO33', function(data) { 
	GPIO33value = data;
	if (GPIO33value != LED33.readSync()) { //only change LED if status has changed
	    LED33.writeSync(GPIO33value); //turn LED on or off
	    console.log('Send new GPIO33 state to ALL clients');
	    io.emit('GPIO33', GPIO33value); //send button status to ALL clients 
	};

    });
    
    // this gets called whenever client presses GPIO15 momentary light button
    socket.on('GPIO15', function(data) { 
	GPIO15value = data;
	if (GPIO15value != LED15.readSync()) { //only change LED if status has changed
	    LED15.writeSync(GPIO15value); //turn LED on or off
	    console.log('Send new GPIO15 state to ALL clients');
	    io.emit('GPIO15', GPIO15value); //send button status to ALL clients e
	};

    });
    
    // this gets called whenever client presses GPIO13 momentary light button
    socket.on('GPIO13', function(data) { 
	GPIO13value = data;
	if (GPIO13value != LED13.readSync()) { //only change LED if status has changed
	    LED13.writeSync(GPIO13value); //turn LED on or off
	    console.log('Send new GPIO13 state to ALL clients');
	    io.emit('GPIO13', GPIO16value); //send button status to ALL clients 
	};
	
    });
 
 

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
	console.log('A user disconnected');
    });
    

}); 