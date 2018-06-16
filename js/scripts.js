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
  bh:0,
  bw:0,

  drawBoard : function(){
    grid.ctx.beginPath();
    
    var x;
    for (x = 0; x <= grid.bw; x += grid.cellWidth) {
        grid.ctx.moveTo(0.5 + x, 0);
        grid.ctx.lineTo(0.5 + x, grid.bh);
    }
    
    
    for (x = 0; x <= grid.bh; x += grid.cellWidth) {
        grid.ctx.moveTo(0, 0.5 + x);
        grid.ctx.lineTo(grid.bw, 0.5 + x);
    }
    
    grid.ctx.strokeStyle = "black";
    grid.ctx.stroke();
  },

  drawModel : function(){
    for (var i = 0; i < model.length; i++) {
      if(model[i]){
        for (var j = 0; j < model[i].length; j++) {
          if(model[i][j])
          grid.fillCell({x:j,y:i});
        }
      }
    }
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
    
    grid.cellWidth = parseInt(document.getElementById("input_cell").value);
    // Box width
    grid.bw = grid.canvas.width - (grid.canvas.width%grid.cellWidth) +1;
    // Box height
    grid.bh = grid.canvas.height- (grid.canvas.height%grid.cellWidth) +1;
    modelController.gridLength = (grid.bw-1)/grid.cellWidth;
    modelController.gridHeight = (grid.bh-1)/grid.cellWidth;
    
    if(document.getElementById('check_borders').checked){
      grid.drawBoard();
    }
    grid.drawModel();
  }
};

var ruleDesigner = {
  cellWidth:15,
  canvas:null,
  ctx:null,
  drawRule : function(){
    ruleDesigner.canvas.height = ruleDesigner.canvas.offsetHeight;
    ruleDesigner.canvas.width = ruleDesigner.canvas.offsetWidth;
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

var modelController = {
  // le modèle est en mode : tableau de ligne, avec chaque ligne qui est un tableau de case.
  currentLine : 0,
  gridLength : 0,
  set : function(point,value){
    if(!model[point.y]){
      model[point.y] = [];
    }
    model[point.y][point.x] = value;
  },
  getValue : function(point){
    if(model[point.y] && model[point.y][point.x]){
      return model[point.y][point.x];
    }else{
      return false;
    }
  },
  run : function(nbIterations){
    for(var i=0;i<nbIterations;i++){
      for(var x=0;x<modelController.gridLength;x++){
        var parentSituation = 7-parseInt(modelController.getParentSituation(x,modelController.currentLine),2);
        var ruleString = parseInt(document.getElementById('input_rule').value).toString(2).padStart(8,'0');
        char = ruleString.charAt(parentSituation);
        if(char==='1'){
          modelController.set({x:x,y:modelController.currentLine+1},true);
        }
      }
      grid.drawModel();
      modelController.currentLine++;
    }
  },
  getParentSituation(col,line){
    var cell1 = modelController.getValue({x:col-1,y:line});
    var cell2 = modelController.getValue({x:col,y:line});
    var cell3 = modelController.getValue({x:col+1,y:line});
    return ""+~~cell1+~~cell2+~~cell3;
  }
};
  
var model = [];
init = function(){
  ruleDesigner.canvas = document.getElementById('canvas_rule');
  ruleDesigner.ctx = ruleDesigner.canvas.getContext("2d");
  document.getElementById('input_rule').addEventListener('input',ruleDesigner.drawRule);
  window.addEventListener('resize', ruleDesigner.drawRule, false);
  ruleDesigner.drawRule();
  
  grid.canvas = document.getElementById('canvas');
  grid.ctx = grid.canvas.getContext('2d');
  grid.canvas.addEventListener('mousedown',function(event){
    var point = {x:event.clientX-grid.canvas.offsetLeft,y:event.clientY-grid.canvas.offsetTop};
    var cell = grid.pixelToGrid(point);
    modelController.set(cell,!modelController.getValue(cell));
    grid.drawStuff();
  });
  
  document.getElementById("input_cell").addEventListener('input',grid.drawStuff);
  document.getElementById("check_borders").addEventListener('click',grid.drawStuff);

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', grid.resizeCanvas, false);
  grid.resizeCanvas();
  
  document.getElementById("btn-run").addEventListener('click',function(){modelController.run(modelController.gridHeight-1)});
  document.getElementById("btn-run1").addEventListener('click',function(){modelController.run(1)});
};

window.addEventListener("load", init());