'use strict';

require('dotenv').load();

var sendgrid = require('sendgrid')(process.env.SENDGRID_KEY);

sendgrid.send({
  to: 'szucs.norbert@outlook.com',
  from: 'coolapp@thefuture.com',
  subject: 'SENDGRID TEST',
  html: `
    <h1>HEY</h1>
  `
}, (err, json) => {
  console.log('err:', err);
  console.log('json:', json);
})
