/**
 * Parse the data from the dom container.
 * @param  {domElement} container - The dom element containing the grid.
 * @return {object} - The parsed data from the html.
 */
function parseDataFromContainer(container, options){
  options = options || {};
  container = container || window.document;
  selector = options.selector || ".application[data-app]";
  var applicationsDom = container.querySelectorAll(selector);
  var applications = [];

  //Process the dom of each application.
  [].forEach.call(applicationsDom, function(appDom) {
    var appId = appDom.getAttribute('data-app');
    var order = appDom.getAttribute('data-order');
    applications.push({id: appId, order: order});
  });
  if(!options.silent){
    container.dispatchEvent(new CustomEvent("application:parse", {detail: applications}));
  }
  return applications;
}

module.exports = {
  parse: parseDataFromContainer
};