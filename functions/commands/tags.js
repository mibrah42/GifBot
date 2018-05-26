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
  // console.log(text);
  axios.post('https://apiv2.indico.io/texttags', JSON.stringify({
    "api_key": '55dcf3395da7de03608a9721a35697ea',
    "data": text,
    "threshold": 0.1,
    "top_n": 5
  }))
  .then(function (response) {
    let js_obj = response.data.results;
    let tags = [];
    for(var key in js_obj) {
      if(key.includes("_")){
        key = key.replace("_", " ")
      }
      tags.push(key);
    }
    let top_tag = tags[0];
    tags = tags.join(" - ");

    // console.log(response.data.results);
    axios.get(`https://api.giphy.com/v1/gifs/translate?api_key=wA4sxNNz8KQMfhxXGV2ePJWaMQkCPXzF&s=${top_tag}`)
    .then(function (response) {

      const url = response.data.data.images.fixed_height_downsampled.url;

      callback(null, {
        text: `Top tags: ${tags}`,
        attachments: [{
          "fallback": top_tag,
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
