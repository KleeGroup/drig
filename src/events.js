/**
 * Selector for all the application dom element.
 * @type {dom}
 */
var applicationsDom = undefined;
/**
 * Source of  the drag element.
 * @type {[type]}
 */
var dragSrcEl = null;

function handleDragStart(e) {
  this.style.opacity = '0.4'; // this / e.target is the source node.
  dragSrcEl = this;
  //console.log('dragSrcEl', 'dragstart', dragSrcEl, this);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
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
  // this / e.target is current target element.
  console.log('drop', e);
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl !== this) {
    var dataOrderReplacement = this.getAttribute('data-order');
    dragSrcEl.setAttribute('data-order', dataOrderReplacement);
    this.parentNode.insertBefore(dragSrcEl, this);
    
    var dragSrcOrder = +dragSrcEl.getAttribute('data-order');
    [].forEach.call(applicationsDom, function(appDom) {
      if (appDom != dragSrcEl) {
        var appOrder = +appDom.getAttribute('data-order');
        if (appOrder >= this.srcOdrer) {
          appDom.setAttribute('data-order', appOrder + 1);
        }
      }
    }, {srcOdrer: dragSrcOrder});
    dragSrcEl = undefined;
    // Set the source column's HTML to the HTML of the column we dropped on.
    //   dragSrcEl.innerHTML = this.innerHTML;
    // this.innerHTML = e.dataTransfer.getData('text/html');
  }

  // See the section on the DataTransfer object.

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
}


function registerEvents(container, selector) {
  container = container || window.document;
  selector = selector || ".application[draggable='true']";
  if (container === undefined || container[0] === undefined) {
    return console.warn('There is no application to register....');
  }
  //Register all application events.
  applicationsDom = container[0].querySelectorAll(selector);
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
}