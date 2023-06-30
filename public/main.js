/************PROCESS DATA TO/FROM Client****************************/

var socket = io(); //load socket.io-client and connect to the host that serves the page
window.addEventListener('load', function () {
    document.addEventListener("mousedown", ReportMouseDown, false);
    document.addEventListener("input", PwmInput, false);
});

let curTemp = document.querySelector('.temp_value');
let curHum = document.querySelector('.hum_value');

socket.on('change_value', data => {
    curTemp.textContent = data.temp;
    curHum.textContent = data.hum;
})

// PWM Process

var slider6 = document.getElementById("PWM6");
var output6 = document.getElementById("val6");
socket.on('PWM6T', function (data) {
    document.getElementById('PWM6').value = data;
    var slider6 = document.getElementById("PWM6");
    var output6 = document.getElementById("val6");
    output6.innerHTML = slider6.value;
    slider6.oninput = function () {
        output6.innerHTML = this.value;
    }
});

var slider13 = document.getElementById("PWM13");
var output13 = document.getElementById("val13");
socket.on('PWM13T', function (data) {
    document.getElementById('PWM13').value = data;
    var slider13 = document.getElementById("PWM13");
    var output13 = document.getElementById("val13");
    output13.innerHTML = slider13.value;
    slider13.oninput = function () {
        output13.innerHTML = this.value;
    }
});

var slider22 = document.getElementById("PWM22");
var output22 = document.getElementById("val22");
socket.on('PWM22T', function (data) {
    document.getElementById('PWM22').value = data;
    var slider22 = document.getElementById("PWM22");
    var output22 = document.getElementById("val22");
    output22.innerHTML = slider22.value;
    slider22.oninput = function () {
        output22.innerHTML = this.value;
    }
});

var slider27 = document.getElementById("PWM27");
var output27 = document.getElementById("val27");
socket.on('PWM27T', function (data) {
    document.getElementById('PWM27').value = data;
    var slider27 = document.getElementById("PWM27");
    var output27 = document.getElementById("val27");
    output27.innerHTML = slider27.value;
    slider27.oninput = function () {
        output27.innerHTML = this.value;
    }
});



function PwmInput(e) {
    if (e.target.id === "PWM6") {
        socket.emit('PWM6', slider6.value);
    } else if (e.target.id === "PWM13") {
        socket.emit('PWM13', slider13.value);
    } else if (e.target.id === "PWM22") {
        socket.emit('PWM22', slider22.value);
    } else if (e.target.id === "PWM27") {
        socket.emit('PWM27', slider27.value);
    }
}


// Send GPIO button toggle to server
socket.on('GPIO6', function (data) {
    const myJSON = JSON.stringify(data);
    document.getElementById('GPIO6').checked = data;
});

socket.on('GPIO13', function (data) {
    const myJSON = JSON.stringify(data);
    document.getElementById('GPIO13').checked = data;
});

socket.on('GPIO22', function (data) {
    const myJSON = JSON.stringify(data);
    document.getElementById('GPIO22').checked = data;
});

socket.on('GPIO27', function (data) {
    const myJSON = JSON.stringify(data);
    document.getElementById('GPIO27').checked = data;
});

// When toggle button is clicked
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

