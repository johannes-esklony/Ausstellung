
var app;
var ob = new Array();


//TODO: load all objects from img and create new class for objects
//!nginx config file:
//location /Ausstellung/img/ {
//    autoindex on;
//    autoindex_exact_size off;
//    autoindex_format html;
//    autoindex_localtime off;
//  }
function load_objects() {
    $.ajax({
        url: "img/img/",
        success: function (data) {
            $(data).find("td > a").each(function () {
                // will loop through 
                alert("Found a file: " + $(this).attr("href"));
            });
        }
    });
    return ob;
}


class Object {
    constructor(path) {

    }
};


class App {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.objects = this.load_objects();



        this.add_canvas();
        var canvas = document.getElementById("main_canvas");
        this.ctx = canvas.getContext("2d");


    }

    //TODO: animate position
    app_update() {
        $("body").prepend("<p>" + "update" + "</p>");
    }


    add_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_view").append("<canvas id='main_canvas' width=" + this.width + " height=" + this.height + "></canvas>");
    }



    resize_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_canvas").attr({ width: `${this.width}`, height: `${this.width}` });
    }

    //TODO: optimize for scale and array of objects
    draw_objects() {
        var drawing = new Image();
        drawing.src = "/Ausstellung/img/1.png";
        drawing.onload = function () {
            ctx.drawImage(drawing, 0, 0);
        }

    }
};


//function not used
function get_dimensions() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    return { w, h };
}


//load all (entrypoint)
window.onload = function () {
    this.app = new App();

    //set update cycle
    //setInterval(update,1);
}


//relay to change scope from window to window.app
function update() {
    app.app_update();
}

window.onresize = function () {
    this.app.resize_canvas();
}

