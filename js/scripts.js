var cellBorders = Object.freeze({
  TOP:1,
  BOTTOM:2,
  RIGHT:3,
  LEFT:4
});

var grid = {
  canvas:null,
  ctx:null,
  cellWidth:10,

  drawBoard : function(){
    grid.cellWidth = parseInt(document.getElementById("input_cell").value);
    // Box width
    var bw = grid.canvas.width - (grid.canvas.width%grid.cellWidth) +1;
    // Box height
    var bh = grid.canvas.height- (grid.canvas.height%grid.cellWidth) +1;
  
    
    grid.ctx.beginPath();
    
    var x;
    for (x = 0; x <= bw; x += grid.cellWidth) {
        grid.ctx.moveTo(0.5 + x, 0);
        grid.ctx.lineTo(0.5 + x, bh);
    }
    
    
    for (x = 0; x <= bh; x += grid.cellWidth) {
        grid.ctx.moveTo(0, 0.5 + x);
        grid.ctx.lineTo(bw, 0.5 + x);
    }
    
    grid.ctx.strokeStyle = "black";
    grid.ctx.stroke();
  },
  
  resizeCanvas : function() {
    grid.canvas.width = window.innerWidth;
    grid.canvas.height = window.innerHeight - grid.canvas.offsetTop;
  
    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
    grid.drawStuff();
  },
  
  fillCell : function(cell){
    pixel = grid.gridToPixel(cell,cellBorders.TOP,cellBorders.LEFT);
    grid.ctx.fillRect(pixel.x,pixel.y,grid.cellWidth,grid.cellWidth);
  },
  
  pixelToGrid : function(pixelPoint){
    return {x:Math.floor((pixelPoint.x/grid.cellWidth)),y:Math.floor(pixelPoint.y/grid.cellWidth)};
  },
  
  gridToPixel : function(cell,hBorder,vBorder){
    var pixel = {x:cell.x*grid.cellWidth,y:cell.y*grid.cellWidth};
    if(hBorder === cellBorders.BOTTOM){
      pixel.x+=grid.cellWidth;
    }
    if(vBorder === cellBorders.RIGHT){
      pixel.y+=grid.cellWidth;
    }
    return pixel;
  },
  
  drawStuff : function() {
    grid.ctx.clearRect(0, 0, grid.canvas.width, grid.canvas.height);
    grid.drawBoard();
    grid.ctx.fillRect(grid.canvas.width/2,10,1,1);
    grid.fillCell({x:3,y:3})
  }
};

var ruleDesigner = {
  cellWidth:15,
  canvas:null,
  ctx:null,
  drawRule : function(){
    ruleDesigner.ctx.clearRect(0,0,ruleDesigner.canvas.width,ruleDesigner.canvas.height);
    
    var ruleBitWidth = Math.floor((ruleDesigner.canvas.width/8));
    var vOffset = Math.floor((ruleDesigner.canvas.height - 2*ruleDesigner.cellWidth)/3);
    var hOffsetTOP = Math.floor((ruleBitWidth-3*ruleDesigner.cellWidth)/2);
    var hOffsetBOTTOM = Math.floor((ruleBitWidth-ruleDesigner.cellWidth)/2);
    var ruleString = parseInt(document.getElementById('input_rule').value).toString(2).padStart(8,'0');
    console.log('rule',ruleString);
    
    var pattern, char, i, j;
    
    for(i=0;i<8;i++){
      ruleDesigner.ctx.strokeRect(i*ruleBitWidth+0.5,0.5,ruleBitWidth,ruleDesigner.canvas.height-0.5);
      pattern = (7-i).toString(2).padStart(3,'0');
      for(j=0;j<3;j++){
        char = pattern.charAt(j);
        if(char==='1'){
          ruleDesigner.ctx.fillRect(i*ruleBitWidth+hOffsetTOP+j*ruleDesigner.cellWidth+0.5,vOffset+0.5,ruleDesigner.cellWidth,ruleDesigner.cellWidth);
        }else{
          ruleDesigner.ctx.strokeRect(i*ruleBitWidth+hOffsetTOP+j*ruleDesigner.cellWidth+0.5,vOffset+0.5,ruleDesigner.cellWidth,ruleDesigner.cellWidth);
        }
      }
      char = ruleString.charAt(i);
      if(char==='1'){
        ruleDesigner.ctx.fillRect(i*ruleBitWidth+hOffsetBOTTOM+0.5,2*vOffset+ruleDesigner.cellWidth+0.5,ruleDesigner.cellWidth,ruleDesigner.cellWidth);
      }else{
        ruleDesigner.ctx.strokeRect(i*ruleBitWidth+hOffsetBOTTOM+0.5,2*vOffset+ruleDesigner.cellWidth+0.5,ruleDesigner.cellWidth,ruleDesigner.cellWidth);
      }
    }
    
  }
};
  
init = function(){
  ruleDesigner.canvas = document.getElementById('canvas_rule');
  ruleDesigner.canvas.height = 50;
  ruleDesigner.canvas.width = ruleDesigner.canvas.parentNode.width;
  ruleDesigner.canvas.width = 500;
  console.log("ruleDesigner.canvas.width",ruleDesigner.canvas.width)
  ruleDesigner.ctx = ruleDesigner.canvas.getContext("2d");
  document.getElementById('input_rule').addEventListener('input',ruleDesigner.drawRule)
  
  grid.canvas = document.getElementById('canvas');
  grid.ctx = grid.canvas.getContext('2d');
  grid.canvas.addEventListener('mousedown',function(){
    var point = {x:event.clientX-grid.canvas.offsetLeft,y:event.clientY-grid.canvas.offsetTop};
    grid.fillCell(grid.pixelToGrid(point));
    
  });
  
  document.getElementById("input_cell").addEventListener('input',grid.drawStuff);

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', grid.resizeCanvas, false);
  grid.resizeCanvas();
};

window.addEventListener("load", init());