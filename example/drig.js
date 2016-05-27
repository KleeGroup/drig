(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var drig = require('./drig');

if(!window){
  throw new Error("Need to be in a web page to work...");
}

if(!window.$){
//  window.$ = require('jquery');
  console.error("noJquery");
}
window.$.fn.drig = drig;
},{"./drig":3}],2:[function(require,module,exports){
/**
 * State variable for the fact that there is a drag over the element Right or left.
 * @type {Boolean}
 */
var isOver = false;
/**
 * Container for the page changer dom elements.
 */
var pageChangers;
var options = require('./optionsParsing').options();
var hiddenClass = options.hiddenClass;
var activeClass = options.activeClass;
var selectorPageNotHidden = '.page:not(.' + hiddenClass + ')[data-page]';

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
  isOver = true;
  var context = this;
  setTimeout(function() {
    if (isOver) {
      console.log('timeout of 1s', context);
      changePage.call(context);
    }
  }, 1000);
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
  var isLeft = e.target.getAttribute('data-change') === "left";
  isOver = false;
}

function changePage(event) {

  var isLeft = this.getAttribute('data-change') === "left";
  console.log('change page', isLeft, this);
  var grid = this.parentNode;
  var currentPage = grid.querySelector('.active');
  var currentPageNumber = +currentPage.getAttribute('data-page');
  if (isLeft) {
     if(currentPageNumber===0){
         event.preventDefault();
         event.stopPropagation();
         return false;
     }
     //on remove la classe hiddenChangePageArrow de la fleche droite.
     var arrowRight = $('a#arrow-right', document);
     if(arrowRight!==undefined && arrowRight!==null && arrowRight.length>0){
       arrowRight.removeClass('hiddenChangePageArrow');
     }
     if(currentPageNumber-1===0){
       this.classList.add('hiddenChangePageArrow');
     }
     if (currentPageNumber > 0) {
       currentPage.classList.add(hiddenClass);
       currentPage.classList.remove(activeClass);
       currentPage.classList.remove('active');
       currentPage.classList.add('active');
       var newActiveClassList = grid.querySelector(".page[data-page='" + (--currentPageNumber) + "']").classList;
       newActiveClassList.remove(hiddenClass);
       newActiveClassList.add(activeClass);
       if(isOver){
         currentPage.classList.remove('active');
         newActiveClassList.add('active');
       }
     } else {
       currentPage.classList.remove('active');
       var nActiveClassListLast= grid.querySelector(".page[data-page='" + (++currentPageNumber) + "']").classList;
       nActiveClassListLast.add('active');
     }
   } else {
     var maxPage = +grid.querySelector('.page[data-page]:last-child').getAttribute('data-page');
     if(currentPageNumber===maxPage){
       event.preventDefault();
       event.stopPropagation();
       return false;
     }
     //on remove la classe hiddenChangePageArrow de la fleche droite.
     var arrowLeft = $('a#arrow-left', document);
     if(arrowLeft!==undefined && arrowLeft!==null && arrowLeft.length>0){
         arrowLeft.removeClass('hiddenChangePageArrow');
     }
     if(currentPageNumber+1===maxPage){
       this.classList.add('hiddenChangePageArrow');
     }
     if (currentPageNumber < maxPage) {
       currentPage.classList.add(hiddenClass);
       currentPage.classList.remove(activeClass);
       currentPage.classList.remove('active');
       currentPage.classList.add('active');
       var nActiveClassList = grid.querySelector(".page[data-page='" + (++currentPageNumber) + "']").classList;
       nActiveClassList.remove(hiddenClass);
       nActiveClassList.add(activeClass);
       if(isOver){
         currentPage.classList.remove('active');
         nActiveClassList.add('active');
       }
     } else {
       currentPage.classList.remove('active');
       var nActiveClassListLast= grid.querySelector(".page[data-page='" + (--currentPageNumber) + "']").classList;
       nActiveClassListLast.add('active');
     }
   }
   isOver = false;
}

/**
 * [registerEvents description]
 * @param  {[type]} container [description]
 * @param  {[type]} selector  [description]
 * @return {[type]}           [description]
 */
function registerEvents(container, selector) {
  container = container || window.document;
  selector = selector || ".changePage[data-change]";
  if (container === undefined) {
    return console.warn('There is no page changer to register....');
  }
  //Register all application events.
  pageChangers = container.querySelectorAll(selector);
  [].forEach.call(pageChangers, function(pageChanger) {
    pageChanger.addEventListener('dragenter', handleDragEnter, false);
    pageChanger.addEventListener('dragover', handleDragOver, false);
    pageChanger.addEventListener('dragleave', handleDragLeave, false);
    pageChanger.addEventListener('click', changePage, false);

  });
}
/**
 * Exported functions of the module.
 * @type {Object}
 */
module.exports = {
  register: registerEvents
};

},{"./optionsParsing":5}],3:[function(require,module,exports){
/*
  Dependencies.
 */

var $ = window.$; //require('jquery');

/**
 * Initialization plugin function which is publish in jquery.
 * @param  {[type]} options
 * @return {[type]}
 */
var drig = function drigJqueryPluginFromHtml(options) {
  options = require('./optionsParsing').parse(options);
  var events = require('./events');
  var changePageEvents = require('./changePageEvents');
  var parser = require('./parser');
  if (options.isData) {
    var html = processData(options.data, options);
    this.html(html);
  }
  var element = this[0];
  events.register(element);
  changePageEvents.register(element);

  //Handle custom events.
  element.addEventListener('application:change-order', function(event) {
    console.info('application:change-order');
    parser.parse(element);
  }, false);
  element.addEventListener('application:parse', function(data) {
    if (options.callback) {
      options.callback(data);
    } else {
      console.log('new appOrder', data);
    }
  }, false);
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

  var pageNumber = parseInt(data.applications.length / options.perPage);
  if (pageNumber * options.perPage < data.applications.length) {
      pageNumber = pageNumber + 1;
  }

  options.pageNumber = pageNumber;

  var templates = require('./templates');
  var domElement = document.createElement('div');
  domElement.innerHTML = templates.grid({
    grid: 'drig'
  }, options);
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
      if(currentPage < options.pageNumber){
        pages[currentPage] = [];
      }
    }
  });

  //console.log('pages', pages);

  pages.forEach(function(page, pageIndex) {
    $('div.pageContainer', domElement).append(templates.page({
      page: pageIndex,
      perPage: options.perPage,
      isHidden: pageIndex !== 0
    }, options));
    var apps = page;
    var pageSelector = ".page[data-page='" + pageIndex + "']";
    apps.forEach(function(application) {
      //console.log("application", application);
      $(pageSelector, domElement).append(templates.application(application, options));
    });

  });

  return domElement;
}

module.exports = drig;

},{"./changePageEvents":2,"./events":4,"./optionsParsing":5,"./parser":7,"./templates":8}],4:[function(require,module,exports){
/**
 * Selector for all the application dom element.
 * @type {dom}
 */
var applicationsDom;
/**
 * Source of  the drag element.
 * @type {[type]}
 */
var dragSrcEl = null;
var elementsContainer;
var pagesGestion = require('./pagesGestion');

function handleDragStart(e) {
  this.style.opacity = '0.4'; // this / e.target is the source node.
  dragSrcEl = this;
  //console.log('dragSrcEl', 'dragstart', dragSrcEl, this);
  e.dataTransfer.effectAllowed = 'move';
  var appId= this.getAttribute('data-apfId');
  var data = {
    isFromBarreFavori: false,
    apfId: appId
  };
  e.dataTransfer.setData('text',  JSON.stringify(data));
  //on met en subrillance la zone favoris;
  var favoris = $('div#favoris', document);
  if(favoris!==undefined && favoris!==null && favoris.length>0){
        favoris.addClass('container-shadow');
  }

  var pageContainer = $('div#applicationsContainer', document);
  if(pageContainer!==undefined && pageContainer!==null && pageContainer.length>0){
        pageContainer.addClass('container-shadow');
  }

  var arrowLeft = $('a#arrow-left', document);
  if(arrowLeft!==undefined && arrowLeft!==null && arrowLeft.length>0){
        arrowLeft.addClass('arrow-shadow');
      }

    var arrowRight = $('a#arrow-right', document);
    if(arrowRight!==undefined && arrowRight!==null && arrowRight.length>0){
          arrowRight.addClass('arrow-shadow');
  }
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {
  e.preventDefault();
  // this / e.target is current target element.
  console.log('drop', e);
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl !== this) {
    //Add the minus notion.
    var originalOrder = +dragSrcEl.getAttribute('data-order');
    var dataOrderReplacement = +this.getAttribute('data-order');
    var isBigger = dataOrderReplacement > originalOrder;
    var isNextRight = false;
    if (isBigger) {
        if(originalOrder+1 === dataOrderReplacement) {
          dragSrcEl.setAttribute('data-order', dataOrderReplacement);
          isNextRight = true;
        } else {
          dragSrcEl.setAttribute('data-order', dataOrderReplacement - 1);
        }
    } else {
      dragSrcEl.setAttribute('data-order', dataOrderReplacement);

    }
    var pageElement = this.parentNode;
    pageElement.insertBefore(dragSrcEl, this);
    //Renumbering applications.
    var dragSrcOrder = +dragSrcEl.getAttribute('data-order');
    [].forEach.call(applicationsDom, function(appDom) {
      if (appDom != dragSrcEl) {
        var appOrder = +appDom.getAttribute('data-order');
        if (this.isMoveRight) {
          if (appOrder > this.departOrder && appOrder < this.arrivalOrder) {
            appDom.setAttribute('data-order', appOrder - 1);
          } else {
            if(true === this.isNextRight && appOrder === this.arrivalOrder) {
              appDom.setAttribute('data-order', appOrder - 1);
            }
          }
        } else {
          if (appOrder >= this.arrivalOrder && appOrder < this.departOrder) {
            appDom.setAttribute('data-order', appOrder + 1);
          }
        }
      }
    }, {
      srcOdrer: dragSrcOrder,
      isMoveRight: isBigger,
      arrivalOrder: dataOrderReplacement,
      departOrder: originalOrder,
      isNextRight: isNextRight
    });

    //Processing pages.
    pagesGestion.clean.call(pageElement.parentNode);

    dragSrcEl = undefined;
    // Set the source column's HTML to the HTML of the column we dropped on.
    //   dragSrcEl.innerHTML = this.innerHTML;
    // this.innerHTML = e.dataTransfer.getData('text/html');
    //

    var favoris = $('div#favoris', document);
    if(favoris!==undefined && favoris!==null && favoris.length>0){
        favoris.removeClass('container-shadow');
    }

    var pageContainer = $('div#applicationsContainer', document);
    if(pageContainer!==undefined && pageContainer!==null && pageContainer.length>0){
          pageContainer.removeClass('container-shadow');
    }

    var arrowLeft = $('a#arrow-left', document);
    if(arrowLeft!==undefined && arrowLeft!==null && arrowLeft.length>0){
          arrowLeft.removeClass('arrow-shadow');
    }

    var arrowRight = $('a#arrow-right', document);
    if(arrowRight!==undefined && arrowRight!==null && arrowRight.length>0){
          arrowRight.removeClass('arrow-shadow');
    }
  }

  // See the section on the DataTransfer object.
  var isIE = (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) || (navigator.userAgent.toLowerCase().indexOf("trident") !== -1);
  if(isIE){
    var newEvent = document.createEvent('Event');
    newEvent.initEvent('application:change-order', true, true);
    elementsContainer.dispatchEvent(newEvent);
  } else {
    elementsContainer.dispatchEvent(new Event('application:change-order'));
  }
  return false;
}

/**
 * Function which is called when the drag has ended.
 * @param  {[type]} e
 * @return {[type]}
 */
function handleDragEnd(e) {
  console.log('dragEnd', e);
  // this/e.target is the source node.
  [].forEach.call(applicationsDom, function(appDom) {
    appDom.classList.remove('over');
    appDom.style.opacity = '1';
  });

  var favoris = $('div#favoris', document);
  if(favoris!==undefined && favoris!==null && favoris.length>0){
    favoris.removeClass('container-shadow');
  }

  var pageContainer = $('div#applicationsContainer', document);
  if(pageContainer!==undefined && pageContainer!==null && pageContainer.length>0){
        pageContainer.removeClass('container-shadow');
  }

  var arrowLeft = $('a#arrow-left', document);
  if(arrowLeft!==undefined && arrowLeft!==null && arrowLeft.length>0){
    arrowLeft.removeClass('arrow-shadow');
  }

  var arrowRight = $('a#arrow-right', document);
  if(arrowRight!==undefined && arrowRight!==null && arrowRight.length>0){
      arrowRight.removeClass('arrow-shadow');
  }
}


function registerEvents(container, selector) {
  container = container || window.document;
  elementsContainer = container;
  selector = selector || ".application[draggable='true']";
  if (container === undefined) {
    return console.warn('There is no application to register....');
  }
  //Register all application events.
  applicationsDom = container.querySelectorAll(selector);
  [].forEach.call(applicationsDom, function(appDom) {
    appDom.addEventListener('dragstart', handleDragStart, false);
    appDom.addEventListener('dragenter', handleDragEnter, false);
    appDom.addEventListener('dragover', handleDragOver, false);
    appDom.addEventListener('dragleave', handleDragLeave, false);
    appDom.addEventListener('drop', handleDrop, false);
    appDom.addEventListener('dragend', handleDragEnd, false);
  });
}


module.exports = {
  handleDragStart: handleDragStart,
  handleDragOver: handleDragOver,
  handleDragEnter: handleDragEnter,
  handleDragLeave: handleDragLeave,
  register: registerEvents
};

},{"./pagesGestion":6}],5:[function(require,module,exports){
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
  options.pageClass = options.pageClass || "";
  options.gridClass = options.gridClass || "";
  options.appClass = options.appClass || "";
  options.hiddenClass = options.hiddenClass || "hidden";
  options.activeClass = options.activeClass || "active";
  
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
},{}],6:[function(require,module,exports){
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

},{"./optionsParsing":5}],7:[function(require,module,exports){
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
    var isIE = (navigator.userAgent.toLowerCase().indexOf("msie") !== -1) || (navigator.userAgent.toLowerCase().indexOf("trident") !== -1);
    if(isIE){
      var newEvent = document.createEvent('Event');
      newEvent.initEvent('application:parse', true, true);
      var customEvent = document.createEvent('CustomEvent');
      var params = params || { bubbles: false, cancelable: false, detail: applications };
      customEvent.initCustomEvent("application:parse",  params.bubbles, params.cancelable, params.detail);
      container.dispatchEvent(customEvent);
    } else {
      container.dispatchEvent(new CustomEvent("application:parse", {detail: applications}));
    }
  }
  return applications;
}

module.exports = {
  parse: parseDataFromContainer
};

},{}],8:[function(require,module,exports){
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
  if(pageData.isHidden === false){
    hidden +=' active';
  }
  var tagName = options.pageTagName || "div";
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

},{"./optionsParsing":5}]},{},[1]);
