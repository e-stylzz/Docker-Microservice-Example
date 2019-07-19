var rabbit = require('amqplib/callback_api');
var queue = 'PhettiQueue';
var config = require('./config');
var nodemailer = require('nodemailer');

var mailServer = nodemailer.createTransport({
    port: config.email.port,
    host: config.email.host,
    secureConnection: config.email.secure,
    tls: { ciphers: config.email.ciphers },
    auth: {
        user: process.env.EMAIL_ADDRESS || config.email.username, 
        pass: process.env.EMAIL_PASSWORD || config.email.password 
    }
});


rabbit.connect('amqp://rabbit:5672', function(err, conn) {
    if (err) {
        fail(err);

    }
    console.log('Connected to Rabbit, starting consumer.');
    console.log('conn', conn);
    consumer(conn);
  });

function fail(err) {
  console.error(err);
  process.exit(1);
}

function consumer(conn) {
  var ok = conn.createChannel(on_open);

  function on_open(err, channel) {
    if (err) {
        fail(err);
    }

    channel.assertQueue(queue);
    channel.consume(queue, function(msg) {
      if (msg !== null) {
          console.log(msg.content);
          var message = JSON.parse(msg.content);  
          console.log('Sending email to:', message.to, 'subject:', message.subject);

          var mailOptions = {}
          mailOptions.from = 'Test <' + config.email.from + '>';
          mailOptions.to = message.to;
          mailOptions.subject = message.subject;
          mailOptions.text = 'This is a generated email from a queue / consumer setup';

          mailServer.sendMail(mailOptions, function(err, result) {
            if (err) {
              console.error(err);
            } else {
              channel.ack(msg);
            }
          })
          
          //channel.ack(msg);
      }
    });
  }
}


