'use strict';

var go = module.exports = function (json) {
 var msg, s = '';

  try { 
    msg = JSON.parse(json); 
  } catch (err) {
    return json; 
  }

  if (msg.stream) return msg.stream.replace('\n', ' ');
  if (msg.status) { 
    s = msg.status;
    if (msg.progress) {
      // jump up one line to show progress animation
      s +=  ' ' + msg.progress + '\u001b[1A';
    }
    return s;
  }

  // somewhat improve npm messages
  if ((/^(npm|http|GET)/).test(msg)) return s;

  return JSON.stringify(msg, null, 2);
}
