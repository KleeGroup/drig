var options = require('./optionsParsing').options();
/**
 * Template of an application.
 * @param  {object} appData - The data of an application.
 * @return {string} - The HTML filled template of an application.
 */
var application = function appTemplate(appData, options) {
  options = options || {};
  if (options.templateApplication) {
    return options.templateApplication(appData, options);
  }
  appData = appData || {};
  var tagName = options.appTagName || "div";
  return "<" + tagName + " class='application "+options.appClass+ "' draggable='true' data-app='" + appData.id + "'  data-order='" + appData.order + "'><header class='title'>" + appData.name + "</header></" + tagName + ">";
};

/**
 * Template of an appgrid page.
 * @param  {object} pageData - The data of the page.
 * @return {string} The filled template of a page.
 */
var page = function pageTemplate(pageData, options) {
  options = options || {};
  pageData = pageData || {};
  if (options.templatePage) {
    return options.templatePage(pageData, options);
  }
  var hidden = pageData.isHidden ? options.hiddenClass : options.activeClass;
  var tagName = options.pageTagName || "div";
  var additionalTagOpening = options.pageAdditionalTag ? ("<"+ options.pageAdditionalTag+">" ): "";
  var additionalTagClosing = options.pageAdditionalTag ? ("</"+ options.pageAdditionalTag+">" ): "";
  return "<" + tagName + " class='page " + options.pageClass + " " + hidden + "' data-page='" + pageData.page + "' data-per-page='" + pageData.perPage + "'></" + tagName + ">";
};

/**
 * Template for a grid.
 * @param  {object} gridData - The data of the application grid.
 * @return {string} The filled template for a grid.
 */
var grid = function gridTemplate(gridData, options) {
  options = options || {};
  if (options.gridTemplate) {
    return options.gridTemplate(gridData, options);
  }
  return "<div class='grid " + options.gridClass + "' data-grid='" + gridData.grid + "'><div class='changePage' data-change='left'><</div><div class='pageContainer'></div><div class='changePage' data-change='right'>></div></div></div>";
};

module.exports = {
  application: application,
  page: page,
  grid: grid
};