const fs = require('fs');
const moment = require('moment');

const logPath = 'server/db/stats.json';

let createLog = (product, action) => {
  fs.readFile(logPath, 'utf-8', (err, data) => {
    if (err) {
      console.log(error);
    } else {
      let newLog = JSON.parse(data);
      newLog.push({product: product, action: action, time: moment().format('MMM Do YY, h:mm:ss a')});
      fs.writeFile(logPath, JSON.stringify(newLog, null, 2), (err => console.log(err)))
    }
  })
};

module.exports = createLog;