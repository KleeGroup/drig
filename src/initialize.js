var drig = require('./drig');

if(!window){
  throw new Error("Need to be in a web page to work...");
}

if(!window.$){
//  window.$ = require('jquery');
  console.error("noJquery");
}
window.$.fn.drig = drig;