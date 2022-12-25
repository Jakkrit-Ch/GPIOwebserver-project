


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
//  console.log('GPIO6 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
//  console.log(myJSON);
  document.getElementById('GPIO6').checked = data;
//  console.log('GPIO6: '+data.toString());
});


//Update gpio feedback when server changes LED state
socket.on('GPIO13', function (data) {  
//  console.log('GPIO13 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
 // console.log(myJSON);
  document.getElementById('GPIO13').checked = data;
//  console.log('GPIO13: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO22', function (data) {  
//  console.log('GPIO22 function called');
 // console.log(data);
  var myJSON = JSON.stringify(data);
 // console.log(myJSON);
  document.getElementById('GPIO22').checked = data;
// console.log('GPIO22: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO27', function (data) {  
//  console.log('GPIO27 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
//  console.log(myJSON);
  document.getElementById('GPIO27').checked = data;
//  console.log('GPIO27: '+data.toString());
});


function ReportTouchStart(e) {
  var y = e.target.previousElementSibling;
  if (y !== null) var x = y.id;
  if (x !== null) { 
  // Now we know that x is defined, we are good to go.
    if (x === "GPIO6") {
 //     console.log("GPIO6 toggle");
      socket.emit("GPIO6T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO13") {
 //     console.log("GPIO13 toggle");
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO22") {
 //      console.log("GPIO22 toggle");
      socket.emit("GPIO22T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO27") {
  //    console.log("GPIO27 toggle");
      socket.emit("GPIO27T");  // send GPIO button toggle to node.js server
    } 
  }

  if (e.target.id === "GPIO6M") {
    socket.emit("GPIO6", 1); 
    document.getElementById('GPIO6').checked = 1;
  } else if (e.target.id === "GPIO13M") {
 //   console.log("GPIO13 pressed");
    socket.emit("GPIO13", 1); 
    document.getElementById('GPIO13').checked = 1;
  } else if (e.target.id === "GPIO22M") {
  //  console.log("GPIO22 pressed");
    socket.emit("GPIO22", 1); 
    document.getElementById('GPIO22').checked = 1;
  } else if (e.target.id === "GPIO27M") {
 //    console.log("GPIO27 pressed");
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
 //     console.log("GPIO6 toggle");
      socket.emit("GPIO6T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO13") {
//     console.log("GPIO13 toggle");
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO22") {
 //     console.log("GPIO22 toggle");
      socket.emit("GPIO22T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO27") {
 //     console.log("GPIO27 toggle");
      socket.emit("GPIO27T");  // send GPIO button toggle to node.js server
    } 
  }
  
  if (e.target.id === "GPIO6M") {
 //   console.log("GPIO6 pressed");
    socket.emit("GPIO6", 1); 
    document.getElementById('GPIO6').checked = 1;
  } else if (e.target.id === "GPIO13M") {
//    console.log("GPIO13 pressed");
    socket.emit("GPIO13", 1); 
    document.getElementById('GPIO13').checked = 1;
  } else if (e.target.id === "GPIO22M") {
//    console.log("GPIO22 pressed");
    socket.emit("GPIO22", 1); 
    document.getElementById('GPIO22').checked = 1;
  } else if (e.target.id === "GPIO27M") {
//    console.log("GPIO27 pressed");
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