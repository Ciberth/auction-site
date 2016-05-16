'use strict';

require('dotenv').config();
var sendgrid  = require('sendgrid')(process.env.SENDGRID_KEY);

exports.sendConfirmation = (email, password) => {
  var email     = new sendgrid.Email({
    to:       email,
    from:     'auction@simpleauctions.com',
    subject:  'Simple Auctions',
    text:     'Thanks for registering at Simple Auctions. Your password is: ' + password
  });
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
}

exports.sendEndedConfirmation = (email) => {
  var email     = new sendgrid.Email({
    to:       email,
    from:     'auction@simpleauctions.com',
    subject:  'Simple Auctions',
    text:     'Your action ended. Thank You for using our platform!'
  });
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log('conf:', json);
  });
}

exports.sendWinConfirmation = (email) => {
  var email     = new sendgrid.Email({
    to:       email,
    from:     'auction@simpleauctions.com',
    subject:  'Simple Auctions',
    text:     'Congratulations. You Won the auction!'
  });
  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
}
