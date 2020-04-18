const bunyan = require('bunyan');


const environment = process.env.NODE_ENV || 'dev';
let options = {
  name: "honest"
};
if (environment === 'local') {
  options['streams'] = [{
    stream: process.stdout
  }];
} 
let appLogger = bunyan.createLogger(options);
module.exports = appLogger;