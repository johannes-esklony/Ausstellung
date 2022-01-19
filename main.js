


//!nginx config file:
//location /Ausstellung/img/ {
//    autoindex on;
//    autoindex_exact_size off;
//    autoindex_format html;
//    autoindex_localtime off;
//  }


//load all (entrypoint)
window.onload = function () {
    //initialize app and objects (to make them global)
    ob = new Array();
    ob_urls = new Array();
    app = new App();
    //load objects
    app.objects = load_objects();
    //set update cycle
    //setInterval(update, 1);
}

//http request requires to wait to load page and then to go on loading objects in load_objects2()
function load_objects() {
    //if on server
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
                load_objects2();
            }
        });
    }
    //if on local machine (due to missing(differently formatted) autoindex)
    else {
        ob_urls = ["1.png"];
        load_objects2();
    }
}

function load_objects2() {
    //fill array
    for (i in ob_urls) {
        ob.push(new App_Object(ob_urls[i], i));
    }
    app.draw_objects();
}

//relay to change scope from window to window.app
function update() {
    app.app_update();
}

//TODO: fix object position after scaling
//window resize handling
window.onresize = function () {
    app.resize_canvas();
    app.draw_objects();
}

class App_Object {
    constructor(path, id) {
        this.id = id;
        this.path = "img/" + path;
        this.img = new Image();
        this.img.src = this.path;
        this.width = this.getWidth(
            this.path,
            function (width) { window.ob[id].width = width; }
        );
        this.height = this.getHeight(
            this.path,
            function (height) { window.ob[id].height = height; }
        );
        this.x = Math.floor(Math.random() * window.app.width);
        this.y = Math.floor(Math.random() * window.app.height);

    }
    getHeight(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () { callback(this.height); }
    }
    getWidth(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () { callback(this.width); }
    }

    draw() {
            window.app.ctx.drawImage(this.img, this.x, this.y, 50, 50);
        
            //create var in order to access it from onload function
            var img_ = this.img;
            var x_ = this.x;
            var y_ = this.y;
            this.img.onload = function () { window.app.ctx.drawImage(img_, x_, y_, 50, 50); }
    }
    //Position is upper left corner
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
};


class App {
    constructor() {
        this.height = window.outerHeight;
        this.width = window.outerWidth;



        this.add_canvas();
        this.canvas = document.getElementById("main_canvas");
        this.ctx = this.canvas.getContext("2d");

    }


    add_canvas() {
        this.height = window.outerHeight;
        this.width = window.outerWidth;
        $("#main_view").append("<canvas id='main_canvas' width=" + this.width + " height=" + this.height + "></canvas>");
    }



    resize_canvas() {
        this.height = window.outerHeight;
        this.width = window.outerWidth;
        $("#main_canvas").attr({ width: `${this.width}`, height: `${this.height}` });
    }
    //----------------------------------------------------------------------------------------------------------------//needs window.app (use in app.onload)

    //TODO: animate position
    app_update() {
        //$("body").prepend("<p>" + "update" + "</p>");
        this.draw_objects();
    }

    //TODO: optimize for scale and array of objects, fix flickering
    draw_objects() {
        var bg = new Image();
        bg.src = "room.jpg";
        bg.onload = function () {
            window.app.ctx.drawImage(bg, 0, 0, window.app.width, window.app.height);
            for (i in ob) {
                window.ob[i].draw();
            }
        }

    }
};
