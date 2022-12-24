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
socket.on('GPIO31', function (data) {  
//  console.log('GPIO31 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
//  console.log(myJSON);
  document.getElementById('GPIO31').checked = data;
//  console.log('GPIO31: '+data.toString());
});


//Update gpio feedback when server changes LED state
socket.on('GPIO33', function (data) {  
//  console.log('GPIO33 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
 // console.log(myJSON);
  document.getElementById('GPIO33').checked = data;
//  console.log('GPIO33: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO15', function (data) {  
//  console.log('GPIO15 function called');
 // console.log(data);
  var myJSON = JSON.stringify(data);
 // console.log(myJSON);
  document.getElementById('GPIO15').checked = data;
// console.log('GPIO15: '+data.toString());
});



//Update gpio feedback when server changes LED state
socket.on('GPIO13', function (data) {  
//  console.log('GPIO13 function called');
//  console.log(data);
  var myJSON = JSON.stringify(data);
//  console.log(myJSON);
  document.getElementById('GPIO13').checked = data;
//  console.log('GPIO13: '+data.toString());
});


function ReportTouchStart(e) {
  var y = e.target.previousElementSibling;
  if (y !== null) var x = y.id;
  if (x !== null) { 
  // Now we know that x is defined, we are good to go.
    if (x === "GPIO31") {
 //     console.log("GPIO31 toggle");
      socket.emit("GPIO31T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO33") {
 //     console.log("GPIO33 toggle");
      socket.emit("GPIO33T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO15") {
//      console.log("GPIO15 toggle");
      socket.emit("GPIO15T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO13") {
  //    console.log("GPIO13 toggle");
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } 
  }

  if (e.target.id === "GPIO31M") {
    socket.emit("GPIO31", 1); 
    document.getElementById('GPIO31').checked = 1;
  } else if (e.target.id === "GPIO33M") {
 //   console.log("GPIO33 pressed");
    socket.emit("GPIO33", 1); 
    document.getElementById('GPIO33').checked = 1;
  } else if (e.target.id === "GPIO15M") {
  //  console.log("GPIO15 pressed");
    socket.emit("GPIO15", 1); 
    document.getElementById('GPIO15').checked = 1;
  } else if (e.target.id === "GPIO13M") {
//    console.log("GPIO13 pressed");
    socket.emit("GPIO13", 1); 
    document.getElementById('GPIO13').checked = 1;
  }
}

function ReportTouchEnd(e) {
  if (e.target.id === "GPIO31M") {
    socket.emit("GPIO31", 0); 
    document.getElementById('GPIO31').checked = 0;
  } else if (e.target.id === "GPIO33M") {
    socket.emit("GPIO33", 0); 
    document.getElementById('GPIO33').checked = 0;
  } else if (e.target.id === "GPIO15M") {
    socket.emit("GPIO15", 0); 
    document.getElementById('GPIO15').checked = 0;
  } else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 0); 
    document.getElementById('GPIO13').checked = 0;
  }
}

function ReportMouseDown(e) {
  
  var y = e.target.previousElementSibling;
  if (y !== null) var x = y.id;
  if (x !== null) { 
  // Now we know that x is defined, we are good to go.
    if (x === "GPIO31") {
 //     console.log("GPIO31 toggle");
      socket.emit("GPIO31T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO33") {
//     console.log("GPIO33 toggle");
      socket.emit("GPIO33T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO15") {
 //     console.log("GPIO15 toggle");
      socket.emit("GPIO15T");  // send GPIO button toggle to node.js server
    } else if (x === "GPIO13") {
 //     console.log("GPIO13 toggle");
      socket.emit("GPIO13T");  // send GPIO button toggle to node.js server
    } 
  }
  
  if (e.target.id === "GPIO31M") {
 //   console.log("GPIO31 pressed");
    socket.emit("GPIO31", 1); 
    document.getElementById('GPIO31').checked = 1;
  } else if (e.target.id === "GPIO33M") {
//    console.log("GPIO33 pressed");
    socket.emit("GPIO33", 1); 
    document.getElementById('GPIO33').checked = 1;
  } else if (e.target.id === "GPIO15M") {
//    console.log("GPIO15 pressed");
    socket.emit("GPIO15", 1); 
    document.getElementById('GPIO15').checked = 1;
  } else if (e.target.id === "GPIO13M") {
//    console.log("GPIO13 pressed");
    socket.emit("GPIO13", 1); 
  }
}


function ReportMouseUp(e) {
  if (e.target.id === "GPIO31M") {
    socket.emit("GPIO31", 0); 
    document.getElementById('GPIO31').checked = 0;
  } else if (e.target.id === "GPIO33M") {
    socket.emit("GPIO33", 0); 
    document.getElementById('GPIO33').checked = 0;
  } else if (e.target.id === "GPIO15M") {
    socket.emit("GPIO15", 0); 
    document.getElementById('GPIO15').checked = 0;
  } else if (e.target.id === "GPIO13M") {
    socket.emit("GPIO13", 0); 
    document.getElementById('GPIO13').checked = 0;
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
