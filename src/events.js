function registerDragEvents(context){
  context = context || this;
  draggableSelector = $("[daragable='true']", context);
  draggableSelector.on('dragStart', function(event){

  });
  draggableSelector.on('dragEnd', function(event){

  });
};

function registerDropEvents(context){
  context = context || this;
  draggableSelector = $("[daragable='true']", context);
  draggableSelector.on('dragStart', function(event){

  })
  draggableSelector.on('dragEnd', function(event){

  });
};

module.exports = {
  drag: registerDragEvents,
  drop: registerDropEvents
}