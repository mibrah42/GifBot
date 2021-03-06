const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const axios = require('axios');
/**
* /test
*
*   Basic "test" command.
*   All Commands use this template, simply create additional files with
*   different names to add commands.
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  axios.post('https://apiv2.indico.io/emotion', JSON.stringify({
    "api_key": 'YOUR_API_KEY',
    "data": text,
    "threshold": 0.1,
    "top_n": 1
  }))
  .then(function (response) {
    let js_obj = response.data.results;
    let emotion;
    for(var key in js_obj) {
      if(js_obj.hasOwnProperty(key)) {
        emotion = key;
        break;
      }
    }
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=YOUR_API_KEY&s=${emotion}`)
    .then(function (response) {

      const url = response.data.data.images.fixed_height_downsampled.url;

      callback(null, {
        text: `This post is: ${emotion}`,
        attachments: [{
          "fallback": emotion,
          "image_url": url

        }
          // You can customize your messages with attachments.
          // See https://api.slack.com/docs/message-attachments for more info.
          ]
        });
    })
    .catch(function (error) {
      console.log(error);
    });
  })
  .catch(function (error) {
    console.log(error);
  });




};
