var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/logs/log-[' + Date(Date.now()).toLocaleString() +']', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

// Launch Express Servee
server.listen(8080, function () {
	console.log('Server running on port 80');
});

app.use('/', express.static(__dirname + '/html/'));

// Get API Content
eval(fs.readFileSync('assets/api/api.js')+'');