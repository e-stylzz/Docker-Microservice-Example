var express = require('express');
var bodyParser = require('body-parser');

// New Rabbit Stuff
var rabbit = require('amqplib/callback_api');
var queue = 'PhettiQueue';

var app = express();
var port = 4001;
var conn;

var connectWithRetry = function() {
  return rabbit.connect('amqp://rabbit:5672', function(err, conn) {
    if (err) {
      console.error('Failed to connect to Rabbit on startup - retrying in 1 second');
      setTimeout(connectWithRetry, 1000);
    }
    console.log('Connected to Rabbit, starting consumer.');
    //consumer(conn);
    conn = conn;
  })
}
connectWithRetry();




// rabbit.connect('amqp://rabbit:5672', function(err, connection) {
//     if (err) {
//         fail(err);
//     }
//     console.log('Connected to Rabbit Mofo');
//     //consumer(conn);
//     conn = connection;
//   });

// function fail(err) {
//   console.error(err);
//   process.exit(1);
// }


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/animals', function(req, res) {
    res.json({"name":"lion"});
});

app.post('/animals', function(req, res) {
    console.log('Request: ', req.body);

    var test = JSON.stringify(req.body);

    var ok = conn.createChannel(on_open);
    function on_open(err, channel) {
        if (err) {
            fail(err);
        } else {
            channel.assertQueue(queue);
            channel.sendToQueue(queue, new Buffer(test));
            res.sendStatus(200);
        }
    }




    // var payload = req.body;
    // payload.routingKey = '';

    // rabbit.publish('PhettiExchange', payload, queue)
    //     .then(function () {
    //         console.log('Sent to Rabbit');
    //     })
    //     .catch(function(err) {
    //         console.log('Error: ', err);
    //     })
})

app.listen(port, function() {
    console.log('API is running my app on PORT: ' + port);
});
