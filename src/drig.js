/*
  Dependencies.
 */
var optionsParsing = require('./optionsParsing');
var events = require('./events');
var $ = require('jquery');

/**
 * Initialization plugin function which is publish in jquery.
 * @param  {[type]} options
 * @return {[type]}
 */
var drig = function drigJqueryPluginFromHtml(options) {
  options = optionsParsing.parse(options);
  if (options.isData) {
    var html = processData(options.data);
    this.html(html);
  }
  events.register(this);
  return this;
};

/**
 * Process the data and display a grid.
 * @param  {data to display.} data
 * @return {[type]}
 */
function processData(data, options) {
  options = options || {};
  options.perPage = options.perPage || 4;
  var templates = require('./templates');
  var domElement = document.createElement('div');
  domElement.innerHTML = templates.grid({
    grid: 'drig'
  });
  var applications = data.applications;
  var pages = [
    []
  ];
  var currentPage = 0,
    newLength;
  applications.forEach(function(application) {
    application.currentPage = currentPage;
    newLength = pages[currentPage].push(application);
    //If the number of app is greater than the max page.
    if (newLength === options.perPage) {
      currentPage++;
      pages[currentPage] = [];
    }
  });

  //console.log('pages', pages);

  pages.forEach(function(page, pageIndex) {
    $('div.pageContainer', domElement).append(templates.page({
      page: pageIndex,
      perPage: options.perPage,
      isHidden: pageIndex !== 0
    }));
    var apps = page;
    var pageSelector = ".page[data-page='" + pageIndex + "']";
    apps.forEach(function(application) {
      console.log("application", application);
      $(pageSelector, domElement).append(templates.application(application));
    });

  })

  return domElement;
}

module.exports = drig;