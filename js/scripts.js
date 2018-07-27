function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

var canvas = {
  canvas:null,
  ctx:null,
  color_bg:"#F4E8C1", //"white"
  color_main:"black",
  padding:50,
  settings:{
    cellsInWidth : 10,
    //cellWidth:50,
    spacing:10,
    radius:100,
    modulo:3
  },
  // palette:[
  //   "#bbf67f",
  //   "#a6df86",
  //   "#91c88c",
  //   "#7bb093",
  //   "#669999",
  //   "#e20245"
  //   ],
  // palette:[
  //   "#6eb686",
  //   "#9aac84",
  //   "#b0a782",
  //   "#d1a081",
  //   "#e79b80",
  //   ],
  palette:[
    "#ffff00",
    "#ff007f",
    "#00ffff",
    "#fc961f"
    ],
  resizeCanvas : function() {
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight - grid.canvas.offsetTop;
    
    var minSide = Math.min(window.innerWidth,window.innerHeight);
    
    canvas.canvas.width = (4/5)*minSide;
    canvas.canvas.height = (4/5)*minSide;
    
    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
    canvas.drawStuff();
  },
  
  hexToRGB:function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  },
  
  lerp:function(a,b,t){
    var color1 = canvas.hexToRGB(a);
    var color2 = canvas.hexToRGB(b);
    
    return "rgb("+((color1.r*t)+(color2.r*1-t))+","+((color1.g*t)+(color2.g*1-t))+","+((color1.b*t)+(color2.b*1-t))+")";
  },
  
  getRainbowColor:function(i, total){
    var frequency = 0.3;
    
    //value = Math.sin(frequency*increment)*amplitude + center;
    
    red   = Math.sin(frequency*i + 0) * 127 + 128;
    green = Math.sin(frequency*i + 2) * 127 + 128;
    blue  = Math.sin(frequency*i + 4) * 127 + 128;
    return "rgba("+red+","+green+","+blue+","+0.1+")";
  },
  
  drawStuff: function() {
    var point;
    var center = {"x":canvas.canvas.width/2,"y":canvas.canvas.height/2};
    var bottomCenter = {"x":canvas.canvas.width/2,"y":canvas.canvas.height};
    var topCenter = {"x":canvas.canvas.width/2,"y":0};
    canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.ctx.clearRect(0,0,canvas.canvas.width,canvas.canvas.height);
    canvas.drawBackground();
    
    var cellLength = ((canvas.canvas.width-4*canvas.padding-(canvas.settings.cellsInWidth-1)*canvas.settings.spacing)/canvas.settings.cellsInWidth);
    for(i=0;i<canvas.settings.cellsInWidth;i++){
      for(j=0;j<canvas.settings.cellsInWidth;j++){
        canvas.ctx.setTransform(1,0,0,1,(i*(cellLength+canvas.settings.spacing))+0.5+2*canvas.padding,(j*(cellLength+canvas.settings.spacing))+0.5+2*canvas.padding);
        var hex = canvas.palette[getRandomInt(0,canvas.palette.length-1)];
        var hex2 = canvas.palette[getRandomInt(0,canvas.palette.length-1)];
        var gradient = canvas.ctx.createLinearGradient(0,0,getRandomInt(0,cellLength),cellLength);
        gradient.addColorStop(0,hexToRGB(hex,0.2));
        gradient.addColorStop(1,hexToRGB(hex2,0.2));
        canvas.ctx.strokeStyle = gradient
        canvas.drawCell(i,j,cellLength);
        canvas.drawCell(i,j,cellLength);
        canvas.drawCell(i,j,cellLength);
        canvas.drawCell(i,j,cellLength);
        canvas.drawCell(i,j,cellLength);
        canvas.drawCell(i,j,cellLength);
      }
    }
    // for(var x=0;x<canvas.canvas.width;x+=cellLength+canvas.settings.spacing){
    //   for(var y=0;y<canvas.canvas.height;y+=cellLength+canvas.settings.spacing){
    //     canvas.drawCell(x,y,cellLength);
    //     canvas.drawCell(x,y,cellLength);
    //   }
    // }
  },
  
  drawCell: function(i,j,cellLength){
    var it, cp1x,cp1y,cp2x,cp2y,cp3x,cp3y;
    canvas.ctx.moveTo(getRandomInt(0,cellLength),getRandomInt(0,cellLength));
    canvas.ctx.beginPath();
    // canvas.ctx.strokeStyle = 'rgba(0,' + Math.floor(255 - 42.5 * i) + ',' +
    //                   Math.floor(255 - 42.5 * j) + ',0.2)';
    for(it=0;it<5;it++){
      cp1x = getRandomInt(0,cellLength);
      cp2x = getRandomInt(0,cellLength);
      cp3x = getRandomInt(0,cellLength);
      cp1y = getRandomInt(0,cellLength);
      cp2y = getRandomInt(0,cellLength);
      cp3y = getRandomInt(0,cellLength);
      canvas.ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,cp3x,cp3y);
    }
    canvas.ctx.stroke();
  },
  
  drawBackground: function(){
    canvas.ctx.fillStyle = "white";
    canvas.ctx.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
    var i;
    // canvas.ctx.fillStyle = canvas.color_bg;
    // for(i=0;i<10000;i++){
    //   canvas.ctx.fillRect(getRandomInt(canvas.padding,canvas.canvas.width-canvas.padding),getRandomInt(canvas.padding,canvas.canvas.height-canvas.padding),1,1);
    // }
  },
  
  distance: function(point1, point2){
    var a = point1.x - point2.x;
    var b = point1.y - point2.y;
    return Math.sqrt( a*a + b*b );
  },
  
  fillCell: function(point) {
    canvas.ctx.fillRect(point.x,point.y,canvas.settings.cellWidth,canvas.settings.cellWidth);
  }
};

canvas.canvas = document.getElementById('canvas');
canvas.ctx = canvas.canvas.getContext('2d');
window.addEventListener('resize', canvas.resizeCanvas, false);
canvas.resizeCanvas();