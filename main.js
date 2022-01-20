
zoom = 100;

window.addEventListener("wheel", e=>{
    if(e.ctrlKey)
      e.preventDefault();//prevent zoom
  });

window.addEventListener("touchstart", touchHandler, false);
function touchHandler(event) {
    if(event.touches.lenght > 1){
        event.preventDefault();
    }
}
//!nginx config file:
//location /Ausstellung/img/ {
//    autoindex on;
//    autoindex_exact_size off;
//    autoindex_format html;
//    autoindex_localtime off;
//  }
window.onscroll = () => { window.scroll(0, 0); };
document.body.style.overflow = "hidden";

//load all (entrypoint)
window.onload = function () {
    //initialize app and objects (to make them global)
    update_screen = true;
    ob = new Array();
    ob_urls = new Array();
    app = new App();
    //set update cycle
    setInterval(update, 10);

    //get urls and load objects after
    get_urls();
}

//http request requires to wait to load page and then to go on loading objects in load_objects2()
function get_urls() {
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
                load_objects();
            }
        });
    }
    //if on local machine (due to missing(differently formatted) autoindex)
    else {
        ob_urls = ["1.png"];
        load_objects();
    }
}

function load_objects() {
    //fill array
    for (i in ob_urls) {
        ob.push(new App_Object(ob_urls[i], i));
    }
    requestAnimationFrame(renderFunction);
}

//relay to change scope from window to window.app
function update() {
    app.app_update();
}

//TODO: fix object position after scaling
//window resize handling
window.onresize = function () {
    app.resize_canvas();
    update_screen = true;
}

class App_Object {
    constructor(path, id) {
        this.id = id;
        this.path = "img/" + path;
        this.img = new Image();
        this.img.onload = requestAnimationFrame(renderFunctionSingle);
        this.img.src = this.path;
        this.width;
        this.getWidth(
            this.path,
            function (width) { ob[id].width = width; }
        );

        
        this.height;
        this.getHeight(
            this.path,
            function (height) { ob[id].height = height; }
        );

        this.x = Math.floor(Math.random() * window.app.width);
        this.y = Math.floor(Math.random() * window.app.height);

        this.scaledStandardWidth = 50;
        this.scaledStandardHeight = 50;

        this.scale = .1;

        this.rotation = 0;
    }
    getHeight(url, callback) {
        var img = new Image();
        img.onload = function () { callback(this.height); }
        img.src = url;
    }
    getWidth(url, callback) {
        var img = new Image();
        img.onload = function () { callback(this.width); }
        img.src = url;
    }

    draw() {
        window.app.ctx.drawImage(this.img, this.x, this.y, this.scaledStandardWidth, this.scaledStandardHeight);
    }

    drawImageCentered(){
        /*
        window.app.ctx.setTransform(this.scale, 0, 0, this.scale, this.x + this.scaledStandardWidth / 2, this.y + this.scaledStandardHeight / 2); // sets scale and origin
        window.app.ctx.rotate(this.rotation);
        window.app.ctx.drawImage(this.img, -this.scaledStandardWidth / 2, -this.scaledStandardHeight / 2, this.scaledStandardWidth, this.scaledStandardHeight);*/

        window.app.ctx.setTransform(this.scale, 0, 0, this.scale, this.x, this.y); // sets scale and origin
        window.app.ctx.rotate(this.rotation);
        window.app.ctx.drawImage(this.img, - (this.width / 2), - (this.height / 2));
    } 

    drawImageCustomCenter(image, x, y, cx, cy, scale, rotation){
        window.app.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        window.app.ctx.rotate(rotation);
        window.app.ctx.drawImage(image, -cx, -cy);
    } 
    //Position is upper left corner
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
};


class App {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;



        this.add_canvas();
        this.canvas = document.getElementById("main_canvas");
        this.ctx = this.canvas.getContext("2d");

        this.bg = new Image();
        this.bg.onload = requestAnimationFrame(renderFunctionSingle);
        this.bg.src = "room.jpg";

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
    //----------------------------------------------------------------------------------------------------------------//needs window.app (use in app.onload)

    //TODO: animate position
    app_update() {
        app.resize_canvas();
        update_screen = true;
        requestAnimationFrame(renderFunctionSingle);
    }
};



(function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // Use event.pageX / event.pageY here
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
})();



(function () {
    document.onclick = handleClick;
    function handleClick(event) {
        var x, y;
        x = mouseX;
        y = mouseY;
        //check for object
        for (i in ob) {
            if (x > ob[i].x && x < ob[i].x + ob[i].scaledStandardWidth && y > ob[i].y && y < ob[i].y + ob[i].scaledStandardHeight) {
                var p = document.location.href;
                while (p.slice(-1) != "/") {
                    p = p.slice(0,-1);
                }
                document.location = p + ob[i].path;
            }
        }
    }
})();



(function () {
    window.on = handleClick;
    function handleClick(event) {

    }
})();

function renderFunction() {
    renderFunctionSingle();

    requestAnimationFrame(renderFunction);
}
function renderFunctionSingle() {
    if (update_screen) {
        update_screen = false;
        window.app.ctx.setTransform(1,0,0,1,0,0);
        window.app.ctx.drawImage(app.bg, 0, 0, window.app.width, window.app.height);
        for (i in ob) {
            window.ob[i].drawImageCentered();
        }
    }
}
