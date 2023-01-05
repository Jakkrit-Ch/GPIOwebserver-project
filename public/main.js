


/************PROCESS DATA TO/FROM Client****************************/

	
var socket = io(); //load socket.io-client and connect to the host that serves the page
window.addEventListener("load", function(){ //when page loads
  if( isMobile.any() ) {
//    alert('Mobile');  
    document.addEventListener("touchstart", ReportTouchStart, false);
    document.addEventListener("touchend", ReportTouchEnd, false);
    document.addEventListener("touchmove", TouchMove, false);
  }else{
//    alert('Desktop');  
    document.addEventListener("mouseup", ReportMouseUp, false);
    document.addEventListener("mousedown", ReportMouseDown, false);
  }
  
});




//Update gpio feedback when server changes LED state
socket.on('GPIO6', function (data) {
  var myJSON = JSON.stringify(data);
  document.getElementById('GPIO6').checked = data;
});


//Update gpio feedback when server changes LED state
socket.on('GPIO13', function (data) {
  var myJSON = JSON.stringify(data);
  document.getElementById('GPIO13').checked = data;
});



//Update gpio feedback when server changes LED state
socket.on('GPIO22', function (data) {
  var myJSON = JSON.stringify(data);
  document.getElementById('GPIO22').checked = data;
});



//Update gpio feedback when server changes LED state
socket.on('GPIO27', function (data) {
  var myJSON = JSON.stringify(data);
  document.getElementById('GPIO27').checked = data;
});


function ReportTouchStart(e) {
  var y = e.target.previousElementSibling;
  if (y !== null) var x = y.id;
  if (x !== null) {
    if (x === "GPIO6") {
      socket.emit("GPIO6T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO13") {
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO22") {
      socket.emit("GPIO22T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO27") {
      socket.emit("GPIO27T");  // send GPIO button toggle to node.js server
    } 
  }

  if (e.target.id === "GPIO6M") {
    socket.emit("GPIO6", 1); 
    document.getElementById('GPIO6').checked = 1;
  } else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 1); 
    document.getElementById('GPIO13').checked = 1;
  } else if (e.target.id === "GPIO22M") {
    socket.emit("GPIO22", 1); 
    document.getElementById('GPIO22').checked = 1;
  } else if (e.target.id === "GPIO27M") {
    socket.emit("GPIO27", 1); 
    document.getElementById('GPIO27').checked = 1;
  }
}

function ReportTouchEnd(e) {
  if (e.target.id === "GPIO6M") {
    socket.emit("GPIO6", 0); 
    document.getElementById('GPIO6').checked = 0;
  } else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 0); 
    document.getElementById('GPIO13').checked = 0;
  } else if (e.target.id === "GPIO22M") {
    socket.emit("GPIO22", 0); 
    document.getElementById('GPIO22').checked = 0;
  } else if (e.target.id === "GPIO27M") {
    socket.emit("GPIO27", 0); 
    document.getElementById('GPIO27').checked = 0;
  }
}


function ReportMouseDown(e) {
  
  var y = e.target.previousElementSibling;
  if (y !== null) var x = y.id;
  if (x !== null) { 
  // Now we know that x is defined, we are good to go.
    if (x === "GPIO6") {
      socket.emit("GPIO6T");  // send GPIO button toggle to node.js server
    } 
    else if (x === "GPIO13") {
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } 
    else if (x === "GPIO22") {
      socket.emit("GPIO22T");  // send GPIO button toggle to node.js server
    } 
    else if (x === "GPIO27") {
      socket.emit("GPIO27T");  // send GPIO button toggle to node.js server
    } 
  }
  
  if (e.target.id === "GPIO6M") {
    socket.emit("GPIO6", 1); 
    document.getElementById('GPIO6').checked = 1;
  } 
  else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 1); 
    document.getElementById('GPIO13').checked = 1;
  } 
  else if (e.target.id === "GPIO22M") {
    socket.emit("GPIO22", 1); 
    document.getElementById('GPIO22').checked = 1;
  } 
  else if (e.target.id === "GPIO27M") {
    socket.emit("GPIO27", 1); 
  }
}


function ReportMouseUp(e) {
  if (e.target.id === "GPIO6M") {
    socket.emit("GPIO6", 0); 
    document.getElementById('GPIO6').checked = 0;
  } else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 0); 
    document.getElementById('GPIO13').checked = 0;
  } else if (e.target.id === "GPIO22M") {
    socket.emit("GPIO22", 0); 
    document.getElementById('GPIO22').checked = 0;
  } else if (e.target.id === "GPIO27M") {
    socket.emit("GPIO27", 0); 
    document.getElementById('GPIO27').checked = 0;
  }
}

function TouchMove(e) {

}



/** function to sense if device is a mobile device ***/ 
// Reference: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser

var isMobile = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};