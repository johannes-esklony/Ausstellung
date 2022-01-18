


//TODO: load all objects from img and create new class for objects
//!nginx config file:
//location /Ausstellung/img/ {
//    autoindex on;
//    autoindex_exact_size off;
//    autoindex_format html;
//    autoindex_localtime off;
//  }
function load_objects() {
    get_object_urls();

    //TODO: size
    //TODO: hitbox
}

function get_object_urls() {
    if (window.location.href == "http://johannes-esklony.de/Ausstellung/") //TODO: change URL on deploy
    {
        $.ajax({
            url: "img/",
            dataType: 'text',
            success: function (data) {
                var elements = $("<pre>").html(data)[0].getElementsByTagName("a");
                for (var i = 1; i < elements.length; i++) {
                    var theText = elements[i].firstChild.nodeValue;
                    // Do something here
                    ob_urls.push(theText);
                    //$("body").prepend(theText);
                }
                for (i in ob_urls) {
                    ob.push(new App_Object(ob_urls[i], i));
                }
            }
        });
    }
    else {
        ob_urls = ["1.png", "1.png"];
        for (i in ob_urls) {
            ob.push(new App_Object(ob_urls[i], i));
        }
    }
}


class App_Object {
    constructor(path, id) {
        this.id = id;
        this.path = "img/" + path;
        this.width = this.getWidth(
            this.path,
            function (width) { window.ob[id].width = width; }
        );
        this.height = this.getHeight(
            this.path,
            function (height) { window.ob[id].height = height; }
        );

    }
    getHeight(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () { callback(this.height); }
        //img.onload = function() { callback(this.height); }
    }
    getWidth(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () { callback(this.width); }
    }

    //Position is upper left corner
    setPosition(x, y) {

    }
};


class App {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.objects = load_objects();



        this.add_canvas();
        var canvas = document.getElementById("main_canvas");
        this.ctx = canvas.getContext("2d");

        //TODO: draw objects

    }

    //TODO: animate position
    app_update() {
        //$("body").prepend("<p>" + "update" + "</p>");
    }


    add_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_view").append("<canvas id='main_canvas' width=" + this.width + " height=" + this.height + "></canvas>");
    }



    resize_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_canvas").attr({ width: `${this.width}`, height: `${this.height}` });
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
    setInterval(update, 1);
}


//relay to change scope from window to window.app
function update() {
    app.app_update();
}

//window resize handling
window.onresize = function () {
    app.resize_canvas();
}

//initialize app and objects (to make them global)
var app;
var ob = new Array();
var ob_urls = new Array();
