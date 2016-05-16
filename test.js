var moment = require('moment');
// var CronJob = require('cron').CronJob;

// try {
//     new CronJob(new Date(), function() {
//         console.log('this should not be printed');
//     })
// } catch(ex) {
//     console.log("cron pattern not valid");
// }

var CronJob = require('cron').CronJob;
var job = new CronJob(new Date(2016,04,15,18,41), function() {
  /* runs once at the specified date. */
    console.log('now');
  }, function () {
    console.log('stopped');
  },
  true, /* Start the job right now */
  'America/Los_Angeles'
);
