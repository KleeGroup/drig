/**
 * State variable for the fact that there is a drag over the element Right or left.
 * @type {Boolean}
 */
var isOver = false;
/**
 * Container for the page changer dom elements.
 */
var pageChangers;

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

function changePage() {
  var isLeft = this.getAttribute('data-change') === "left";
  console.log('change page', isLeft, this);
  var grid = this.parentNode;
  var currentPage = grid.querySelector('.page:not(.hidden)[data-page]');
  var currentPageNumber = +currentPage.getAttribute('data-page');
  if (isLeft) {
    if (currentPageNumber > 0) {
      currentPage.classList.add('hidden');
      grid.querySelector(".page[data-page='"+(--currentPageNumber)+"']").classList.remove('hidden');
    }
  }else{
    var maxPage = +grid.querySelector('.page[data-page]:last-child').getAttribute('data-page');
    if(currentPageNumber < maxPage){
     currentPage.classList.add('hidden');
     grid.querySelector(".page[data-page='"+(++currentPageNumber)+"']").classList.remove('hidden');
    }
  }
}

function registerEvents(container, selector) {
  container = container || window.document;
  selector = selector || ".changePage[data-change]";
  if (container === undefined || container[0] === undefined) {
    return console.warn('There is no page changer to register....');
  }
  //Register all application events.
  pageChangers = container[0].querySelectorAll(selector);
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