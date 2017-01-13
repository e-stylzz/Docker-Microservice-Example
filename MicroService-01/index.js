var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/animals', function(req, res) {
    res.json({"name":"tiger"});
});

app.listen(port, function() {
    console.log('API is running my app on PORT: ' + port);
});
