/*
  Dependencies.
 */
var optionsParsing = require('./optionsParsing');
var $ = require('jquery');
/**
 * Initialization plugin function which is publish in jquery.
 * @param  {[type]} options
 * @return {[type]}
 */
var drig = function drigJqueryPluginFromHtml(options){
  options = optionsParsing.parse(options);
  if(options.isData){
    var html = processData(options.data);
    this.html(html);
  }
  return this;
};

function processData(data){
  var templates = require('./templates');
  var domElement = document.createElement('div');
  domElement.innerHTML = templates.grid({grid: 'drig'});
  $('div.pageContainer', domElement).html(templates.page({page: 1, perPage: 6}));
  var applications = data.applications;
  applications.forEach(function(application){
    console.log("application", application);
    $('.page',domElement).append(templates.application(application));
  });
  return domElement;
}

module.exports = drig;

