var assert = require('assert');
var mailer = require('./mailer');

function alert(stringerName, alertContent) {
  assert(stringerName, 'Stringer name must be given, to alert');
  assert(alertContent, 'To alert, content must be provided');
  mailer.sendAlert(stringerName, alertContent);
}

module.exports = {
  alert: alert
}
