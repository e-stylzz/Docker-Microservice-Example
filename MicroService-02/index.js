var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 4002;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/user', function(req, res) {
    res.json({"id":"14","name":"eric barb"});
});

app.listen(port, function() {
    console.log('API is running my app on PORT: ' + port);
});

