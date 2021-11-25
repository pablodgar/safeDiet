const express = require("express");
const logger = require('morgan');
const bodyParser = require("body-parser");

// This will be our application entry. We'll setup our server here.
const http = require('http');
// Set up the express app
const app = express();

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     if ('OPTIONS' == req.method) {
          res.send(200);
     }
     else {
          next();
     }
});




// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Setup a default catch-all route that sends back a welcome message in JSON format.
require('./routes')(app);
app.get('*', (req, res) => res.status(200).send({
     message: 'Welcome to the beginning of nothingness.',
}));
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
module.exports = app;
console.log(`Listening on port ${port}`)
