var nm = require("nodemailer");
var assets = require('./assets.js');
var mailerSetup = require('./mailer-setup');
var t = nm.createTransport();

function reloadSetup(callback) {

}

function sendAlert(stringerName, alertContent) {
  assets.read('user-email.json', function(err, data) {
    t.sendMail({
      from: "bot@data.string.er",
      to: data,
      subject: "ALERT for " + stringerName,
      text: "On today's run, " + stringerName + "generated an alert, with the " +
          "following content:\n" + alertContent // TODO pretty print the object
    },
    function(err, info) {
      if(err) {
        console.log(err);
      }
    });
  });

}

module.exports = {
  sendAlert: sendAlert,
  reloadSetup: reloadSetup,
};
