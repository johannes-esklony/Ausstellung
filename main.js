
var app;

class App{
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.hx = "100";
        this.objects = this.load_objects();



        this.add_canvas();
        var canvas = document.getElementById("main_canvas");
        this.ctx = canvas.getContext("2d");


    }

    
    app_update() {
        $("body").prepend("<p>"+"update"+"</p>");
    }
    
    add_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_view").append("<canvas id='main_canvas' width="+this.width+" height="+this.height+"></canvas>");
    }
    
    resize_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_canvas").attr( {width : `${this.width}`, height: `${this.width}`});
    }
    
    load_objects() {    
        var ob = new Array();
    

        return ob;
    }
      
    draw_objects() {
        var drawing = new Image();
        drawing.src = "/Ausstellung/img/1.png";
        drawing.onload = function() {
            ctx.drawImage(drawing,0,0);
         }
         
    }
};

function get_dimensions()
{
    let w = window.innerWidth;
    let h = window.innerHeight;
    return {w, h};
}    



window.onload = function(){
    this.app = new App();

    //set update cycle
    //setInterval(update,1);
}     

function update() {
    app.app_update();
}

window.onresize = function(){
    this.app.resize_canvas();
}    

