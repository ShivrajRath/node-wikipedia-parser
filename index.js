var express = require('express');
var app = express();
var parser = require('./parser');

app.get('/', function(req, res) {

    var url = 'https://en.wikipedia.org/w/index.php?title=History_of_India&printable=yes';
    
    parser.parse(url, function(parsedData){
        res.send(parsedData);
    });
    
});

var port = process.env.PORT || 3000;
app.listen(port);
console.info('Application started on port: ' + port);
