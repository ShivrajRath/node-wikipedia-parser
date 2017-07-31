var express = require('express'),
    parser = require('./parser'),
    config = require('./CONFIG.json');

var app = express();

/**
 * Exposes an API to retrieve wikipedia object from the page title
 */
app.get('/getWikiObj/:title', function(req, res) {
    parser.parse(req.params.title, function(parsedData) {
        res.send(parsedData);
    });
});

// Start the app
var port = process.env.PORT || config.PORT;
app.listen(port);
console.info('Application started on port: ' + port);
