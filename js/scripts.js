var cellBorders = Object.freeze({
  TOP:1,
  BOTTOM:2,
  RIGHT:3,
  LEFT:4
});
var ca = {canvas:null,ctx:null,cellWidth:10};

ca.drawBoard = function(){
  ca.cellWidth = parseInt(document.getElementById("input_cell").value);
  // Box width
  var bw = ca.canvas.width - (ca.canvas.width%ca.cellWidth) +1;
  // Box height
  var bh = ca.canvas.height- (ca.canvas.height%ca.cellWidth) +1;

  
  ca.ctx.beginPath();
  
  var x;
  for (x = 0; x <= bw; x += ca.cellWidth) {
      ca.ctx.moveTo(0.5 + x, 0);
      ca.ctx.lineTo(0.5 + x, bh);
  }
  
  
  for (x = 0; x <= bh; x += ca.cellWidth) {
      ca.ctx.moveTo(0, 0.5 + x);
      ca.ctx.lineTo(bw, 0.5 + x);
  }
  
  ca.ctx.strokeStyle = "black";
  ca.ctx.stroke();
};

ca.init = function(){
  ca.canvas = document.getElementById('canvas');
  ca.ctx = ca.canvas.getContext('2d');
  ca.canvas.addEventListener('mousedown',function(){
    let point = {x:event.clientX-ca.canvas.offsetLeft,y:event.clientY-ca.canvas.offsetTop};
    ca.fillCell(ca.pixelToGrid(point));
    
  });
  
  document.getElementById("input_cell").addEventListener('input',ca.drawStuff);

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', ca.resizeCanvas, false);
  ca.resizeCanvas();
};

ca.resizeCanvas = function() {
  ca.canvas.width = window.innerWidth;
  ca.canvas.height = window.innerHeight - ca.canvas.offsetTop;

  /**
   * Your drawings need to be inside this function otherwise they will be reset when
   * you resize the browser window and the canvas goes will be cleared.
   */
  ca.drawStuff();
};

ca.fillCell = function(cell){
  pixel = ca.gridToPixel(cell,cellBorders.TOP,cellBorders.LEFT);
  ca.ctx.fillRect(pixel.x,pixel.y,ca.cellWidth,ca.cellWidth);
};

ca.pixelToGrid = function(pixelPoint){
  return {x:Math.floor((pixelPoint.x/ca.cellWidth)),y:Math.floor(pixelPoint.y/ca.cellWidth)};
};

ca.gridToPixel = function(cell,hBorder,vBorder){
  var pixel = {x:cell.x*ca.cellWidth,y:cell.y*ca.cellWidth};
  if(hBorder === cellBorders.BOTTOM){
    pixel.x+=ca.cellWidth;
  }
  if(vBorder === cellBorders.RIGHT){
    pixel.y+=ca.cellWidth;
  }
  return pixel;
};

ca.drawStuff = function() {
  ca.ctx.clearRect(0, 0, ca.canvas.width, ca.canvas.height);
  ca.drawBoard();
  ca.ctx.fillRect(ca.canvas.width/2,10,1,1);
  ca.fillCell({x:3,y:3})
};

window.addEventListener("load", ca.init());