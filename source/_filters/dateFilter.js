const moment = require('moment');
module.exports = (date, format) =>
  moment(date).format(format || 'YYYY-MM-DD');
