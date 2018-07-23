var canvas = {
  canvas:null,
  ctx:null,
  color_bg:"white",
  color_main:"black",
  padding:50,
  settings:{
    cellWidth:2,
    radius:100,
    modulo:3
  },
  palette:[
    "#bbf67f",
    "#a6df86",
    "#91c88c",
    "#7bb093",
    "#669999"
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
    canvas.ctx.fillStyle = canvas.color_bg;
    canvas.ctx.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
    canvas.ctx.fillStyle = canvas.color_main;
    for(var x=0;x<canvas.canvas.width;x+=canvas.settings.cellWidth){
      for(var y=0;y<canvas.canvas.height;y+=canvas.settings.cellWidth){
        point = {"x":x,"y":y};
        canvas.ctx.fillStyle = "rgba(0,0,0,"+(((point.x ^ point.y) % canvas.settings.modulo )/(canvas.settings.modulo*2))+")";
        if(canvas.getCondition(point)) canvas.fillCell(point);
        
        canvas.ctx.fillStyle = canvas.color_main;
        if(canvas.getConditionBis(point)) canvas.fillCell(point);
      }
    }
  },
  
  distance: function(point1, point2){
    var a = point1.x - point2.x;
    var b = point1.y - point2.y;
    return Math.sqrt( a*a + b*b );
  },
  
  getCondition: function(point){
    var center = {"x":canvas.canvas.width/2,"y":canvas.canvas.height/2};
    var bottomCenter = {"x":canvas.canvas.width/2,"y":canvas.canvas.height};
    var topCenter = {"x":canvas.canvas.width/2,"y":0};
    return (/*canvas.distance(point,center)<canvas.settings.radius|| */canvas.distance(point,bottomCenter)<canvas.settings.radius || canvas.distance(point,topCenter)<canvas.settings.radius);//&& (((point.x ^ point.y) % 3 ) %2 === 1);
  },
  
  getConditionBis: function(point){
    var center = {"x":canvas.canvas.width/2,"y":canvas.canvas.height/2};
    var topCenter = {"x":canvas.canvas.width/2,"y":0};
    return (canvas.distance(point,center)<canvas.settings.radius || canvas.distance(point,topCenter)<canvas.settings.radius) && (((point.x ^ point.y) % canvas.settings.modulo ) %2 === 1);
  },
  
  fillCell: function(point) {
    canvas.ctx.fillRect(point.x,point.y,canvas.settings.cellWidth,canvas.settings.cellWidth);
  }
};

canvas.canvas = document.getElementById('canvas');
canvas.ctx = canvas.canvas.getContext('2d');
window.addEventListener('resize', canvas.resizeCanvas, false);
canvas.resizeCanvas();