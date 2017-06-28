var express = require('express');
var http = require('http');
var jsonfile = require('jsonfile');

var router = express();


var file = 'configuration.json';
var config;
var serverName;
jsonfile.readFile(file, function(err, obj) {
    if (err)
        console.log(err);
    else {
        config = obj;
        console.log(serverName + " - Configuration Loaded");
        serverName = obj.serverName;
        initialize();
    }
});

function initialize() {
    console.log(serverName + " - Applications initializing");
    config.apps.forEach(initApp);
}

function initApp(app, index) {


    console.log(serverName + " - App : " + app.name);
    console.log(serverName + " - Port: " + app.port);
    console.log("-----------------------------");

    var server = http.createServer(router);
    server._app = app;
    server.__modules = {};

    console.log(serverName + " - Server created for " + app.name);

    console.log(serverName + " - Loading modules according configuration file");
    server._app.modules.forEach(function(obj, i) {
        server.__modules[obj.name] = require("./apps/" + server._app.name + "/" + obj.name);
        server.__modules[obj.name]["request"] = {};
        server.__modules[obj.name]["response"] = {};
        server.__modules[obj.name]["initOnRequest"] = function(req, res) {
            this.request = req;
            this.response = res;
        };
        server.__modules[obj.name]["clearOnRequest"] = function() {
            this.request = {};
            this.response = {};
        };
        console.log("         ./apps/" + server._app.name + "/" + obj.name);
    });

    console.log(serverName + " - all modules loaded");


    server.listen( app.port, "0.0.0.0", function() {
        var addr = server.address();
        console.log(serverName + " - " + server._app.name + " server listening at ", addr.address + ":" + addr.port);
    });

    router.all("*", onRequest);
}


function onRequest(req, res) {

    console.log(serverName + " - request started : " + req.path)

    var items = req.path.split("/")
    var modulename = items[1];
    var methodname = items[2];
    
    req.socket.server.__modules[modulename]["initOnRequest"](req, res);
    req.socket.server.__modules[modulename][methodname]();
    req.socket.server.__modules[modulename]["clearOnRequest"]();
}
