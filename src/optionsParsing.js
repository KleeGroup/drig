var defaults = {
  isData: false
};
/**
 * Parse the options useng the defaults and the options argument.
 * @param  {object} options - Options to parse.
 * @return {object} The parsed options.
 */
function parseOptions(options) {
  options = options || {};
  if(options.data){
    options.isData = true;
  }

  return {};
}

/**
 * Exported modules.
 * @type {Object}
 */
module.exports = {
  parse: parseOptions
};