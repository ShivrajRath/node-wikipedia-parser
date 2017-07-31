## Wikipedia parser

This aims to parse a wikipedia page into structured machine readable object.

## Usage

```javascript
    var parser = require('./parser');
    parser.parse(title, function(parsedObj) {
        // Do whatever with parsedObj
    });
```

## Dependencies
It uses ```request``` and ```cheerio```  npm packages to make http call and parse the DOM.