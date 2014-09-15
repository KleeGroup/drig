var defaults = {
  isData: false
};
var opts;
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
  options.perPage = options.perPage ||4;
  opts = options;
  return options;
}

/**
 * Exported modules.
 * @type {Object}
 */
module.exports = {
  parse: parseOptions,
  options : function(){
    return opts;
  }
};