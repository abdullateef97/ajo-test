const config = require('../constants/config');
const unirest = require('unirest')


class sendSmsHelper {
  constructor(logger) {
    this.logger = logger;
    this.logger.info('initializing sms sender');
    this.BASE_URL = ` https://account.kudisms.net/api/?username=${config.kudiSms.user}&password=${config.kudiSms.password}`
  }

  sendSms(recipient, message, sender = config.kudiSms.messageSender) {
    return new Promise((resolve, reject) => {
      this.logger.info(`starting to send sms to ${recipient}`);

      let url = `${this.BASE_URL}&message=${message}&sender=${sender}&mobiles=${recipient}`
      return unirest.get(url).end(response => {
        // console.log('response', response.body)
        let data = response.body;
        if(data.error) return reject(data.error)
        return resolve()
      })

    });
  }

  sendOtp(recipient, otp) {
    return new Promise((resolve, reject) => {
      this.logger.info('sending otp to ', recipient);
      const message = `Your otp is ${otp}. \n Otp expires in 5 minutes`;
      this.sendSms(recipient, message).then(() => {
        resolve();
      }).catch((err) => {
        this.logger.info(`error sending otp ${err}`);
        reject(err);
      });
    });
  }
}

module.exports = sendSmsHelper;
