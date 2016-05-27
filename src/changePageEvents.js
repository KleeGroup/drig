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
