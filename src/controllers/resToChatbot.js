const fetch = require("node-fetch");
const config = require("../config");

exports.sendTextMessage = async(text, txtRes) => {

  await fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        sender_action: 'typing_on', 
      })
    }
  );
  
  await fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        message: text
      }),
    },
  );

  await fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        message: txtRes
      }),
    },
  );

  await fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${config.PAGE_ACCESS_TOKEN}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        sender_action: 'typing_off', 
      })
    }
  );
};