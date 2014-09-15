/**
 * Clean the pages with too  much applications.
 * @return {[type]} [description]
 */
function cleanPages(container){
  container = container || this;
  var pages = container.querySelectorAll('.page[data-page]');
  var appToPushNext;
  var opts = require('./optionsParsing').options();
  [].forEach.call(pages, function(page){
    //Insert an app from the previous page.
    if(appToPushNext){
      page.appendChild(appToPushNext);
    }
    var apps = page.querySelectorAll('.application[data-app]');
    var appsLength = apps.length;
    if(appsLength > opts.perPage){
      appToPushNext = apps[appsLength - 1];
    }
  });
}

/**
 * Module de gestion des pages.
 * @type {Object}
 */
module.exports = {
  clean: cleanPages
};
