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
