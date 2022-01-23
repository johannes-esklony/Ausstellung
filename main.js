
zoom = 1.0;
maxzoom = .2;
minzoom = 1;
scale = 1;
mouseX = 0;
mouseY = 0;

cameraOffsetX = 0;
cameraOffsetY = 0;


(function () {
    window.addEventListener("wheel", e => {
        e.preventDefault();//prevent zoom
    }, { passive: false });

    window.onwheel = handleZoom;
    function handleZoom(e) {
        zoom -= (e.deltaY) * .001;
        if (zoom < maxzoom) {
            zoom = maxzoom;
        }
        else if (zoom > minzoom) {
            zoom = minzoom;
        }
        var _x = (cameraOffsetX + mouseX) / (app.width * scale);
        var _y = (cameraOffsetY + mouseY) / (app.height * scale);
        scale = 1 / zoom;

        ///cameraoffset, scale

        cameraOffsetX = _x * app.width * scale - mouseX;
        cameraOffsetY = _y * scale * app.height - mouseY;

        ///

        if (cameraOffsetX > scale * app.width - app.width) {
            cameraOffsetX = scale * app.width - app.width
        } else if (cameraOffsetX < 0) {
            cameraOffsetX = 0;
        }
        if (cameraOffsetY > scale * app.height - app.height) {
            cameraOffsetY = scale * app.height - app.height
        } else if (cameraOffsetY < 0) {
            cameraOffsetY = 0;
        }

        update_screen = true;
    }
})();


(function () {
    window.addEventListener("touchstart", touchstartHandler, { passive: false });
    window.addEventListener("touchmove", touchHandler, { passive: false });
    window.addEventListener("touchend", touchendHandler, { passive: false });
    var _lastxleft;
    var _lastxright;
    var _lastyupper;
    var _lastylower;
    var _firstcalldrag = true;
    var _firstcallzoom = true;
    var moved = false;
    function touchHandler(event) {
        moved = true;
        event.preventDefault();

        if (event.touches.length == 2) {
            var deltaX1, deltaX2, deltaY1, deltaY2;
            var leftX, rightX, upperY, lowerY;
            if (event.touches.item(0).clientX < event.touches.item(1).clientX) {
                leftX = event.touches.item(0).clientX;
                rightX = event.touches.item(1).clientX;
            } else {
                rightX = event.touches.item(0).clientX;
                leftX = event.touches.item(1).clientX;
            }
            if (event.touches.item(0).clientY < event.touches.item(1).clientY) {
                upperY = event.touches.item(0).clientY;
                lowerY = event.touches.item(1).clientY;
            } else {
                lowerY = event.touches.item(0).clientY;
                upperY = event.touches.item(1).clientY;
            }

            if (!_firstcallzoom) {
                deltaX1 = _lastxleft - leftX;
                deltaY1 = _lastyupper - upperY;

                deltaX2 = _lastxright - rightX;
                deltaY2 = _lastylower - lowerY;
                zoom -= ((deltaX1 - deltaX2) + (deltaY1 - deltaY2)) * .002;
                if (zoom < maxzoom) {
                    zoom = maxzoom;
                }
                else if (zoom > minzoom) {
                    zoom = minzoom;
                }

                var midX, midY;
                midX = leftX + ((rightX - leftX) / 2);
                midY = upperY + ((lowerY -upperY) / 2);

                var _x = (cameraOffsetX + midX) / (app.width * scale);
                var _y = (cameraOffsetY + midY) / (app.height * scale);
                scale = 1 / zoom;

                cameraOffsetX = _x * app.width * scale - midX;
                cameraOffsetY = _y * scale * app.height - midY;
                
                if (cameraOffsetX > scale * app.width - app.width) {
                    cameraOffsetX = scale * app.width - app.width
                } else if (cameraOffsetX < 0) {
                    cameraOffsetX = 0;
                }
                if (cameraOffsetY > scale * app.height - app.height) {
                    cameraOffsetY = scale * app.height - app.height
                } else if (cameraOffsetY < 0) {
                    cameraOffsetY = 0;
                }

                update_screen = true;
            }
            _lastxleft = leftX;
            _lastyupper = upperY;

            _lastxright = rightX;
            _lastylower = lowerY;
            _firstcallzoom = false;
        }
        else if (event.touches.length == 1) {
            if (_firstcalldrag) {
                _firstcalldrag = false;
                _lastx = event.touches.item(0).clientX;
                _lasty = event.touches.item(0).clientY;
            }
            else {
                var deltaX = _lastx - event.touches.item(0).clientX;
                var deltaY = _lasty - event.touches.item(0).clientY;
                _lastx = event.touches.item(0).clientX;
                _lasty = event.touches.item(0).clientY;

                cameraOffsetX += deltaX * scale * .8;
                cameraOffsetY += deltaY * scale * .8;

                if (cameraOffsetX > scale * app.width - app.width) {
                    cameraOffsetX = scale * app.width - app.width;
                } else if (cameraOffsetX < 0) {
                    cameraOffsetX = 0;
                }
                if (cameraOffsetY > scale * app.height - app.height) {
                    cameraOffsetY = scale * app.height - app.height;
                } else if (cameraOffsetY < 0) {
                    cameraOffsetY = 0;
                }

                update_screen = true;
            }
        }
    }

    function touchendHandler(event) {
        event.preventDefault();
        _firstcalldrag = true;
        _firstcallzoom = true;
        if (!moved && event.changedTouches.length == 1) {
            var x, y;
            x = event.changedTouches.item(0).clientX;
            y = event.changedTouches.item(0).clientY;
            //check for object
            for (i in ob) {
                ob[i].checkClick(x, y);
            }
        }

    }

    function touchstartHandler(event) {
        event.preventDefault();
        moved = false;
    }

})();


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
    //dynamic, if on server
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
    //static, if on local machine (due to missing(differently formatted) autoindex)
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
    requestAnimationFrame(renderFunctionSingle);
}

//window resize handling
window.onresize = handleResize;
function handleResize() {
    app.resize_canvas();

    //adjust the object location
    for (i in ob) {
        ob[i].resize();
    }
    window.app.lastheight = window.app.height;
    window.app.lastwidth = window.app.width;

    update_screen = true;
    requestAnimationFrame(renderFunctionSingle);
}

window.addEventListener("deviceorientation", handleResize, true);


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

        this.rotation = 0.1;
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

    resize() {
        this.x = this.x * (window.app.width / window.app.lastwidth);
        this.y = this.y * (window.app.height / window.app.lastheight);
    }

    checkClick(x_, y_) {
        var adjustedx = scale * this.x;
        var adjustedy = scale * this.y;
        var adjustedcx = cameraOffsetX + x_;
        var adjustedcy = cameraOffsetY + y_;
        if (adjustedcx > adjustedx - ((this.scaledStandardWidth * scale) / 2) && adjustedcx < adjustedx + ((this.scaledStandardWidth * scale) / 2) && adjustedcy > adjustedy - ((this.scaledStandardHeight * scale) / 2) && adjustedcy < adjustedy + ((this.scaledStandardHeight * scale) / 2)) {
            var p = document.location.href;
            while (p.slice(-1) != "/") {
                p = p.slice(0, -1);
            }
            document.location = p + ob[i].path;
        }
    }

    draw() {
        window.app.ctx.drawImage(this.img, this.x, this.y, this.scaledStandardWidth, this.scaledStandardHeight);
    }

    drawImageCentered() {
        window.app.ctx.setTransform(scale, 0, 0, scale, this.x * scale - cameraOffsetX, this.y * scale - cameraOffsetY); // sets scale and origin
        window.app.ctx.rotate(this.rotation);
        window.app.ctx.drawImage(this.img, -(this.scaledStandardWidth / 2), - (this.scaledStandardHeight / 2), this.scaledStandardWidth, this.scaledStandardHeight);
        window.app.ctx.rotate(0);
        window.app.ctx.setTransform(scale, 0, 0, scale, 0 - cameraOffsetX, 0 - cameraOffsetY);

    }

    drawImageCustomCenter(image, x, y, cx, cy, scale, rotation) {
        window.app.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        window.app.ctx.rotate(rotation);
        window.app.ctx.drawImage(image, -cx, -cy);
    }
    //Position is center
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
};


class App {
    constructor() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;

        this.lastheight = this.height;
        this.lastwidth = this.width;

        this.resize_canvas();
        this.canvas = document.getElementById("main_canvas");
        this.ctx = this.canvas.getContext("2d");

        this.bg = new Image();
        this.bg.onload = requestAnimationFrame(renderFunctionSingle);
        this.bg.src = "room.jpg";

    }



    resize_canvas() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        $("#main_canvas").attr({ width: `${this.width}`, height: `${this.height}` });
    }
    //----------------------------------------------------------------------------------------------------------------//needs window.app (use in app.onload)

    //TODO: animate position
    app_update() {

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
    var _lastx;
    var _lasty;
    var _firstcall = true;
    var drag;
    var moved = false;
    window.onmousedown = handleDrag;
    function handleDrag(e) {
        if (_firstcall) {
            moved = false;
            _firstcall = false;
            _lastx = e.clientX;
            _lasty = e.clientY;
            drag = setInterval(handleDrag, 1);
        }
        else {
            var deltaX = _lastx - mouseX;
            var deltaY = _lasty - mouseY;
            if(deltaX != 0 || deltaY != 0){
                moved = true;
            }
            _lastx = mouseX;
            _lasty = mouseY;

            cameraOffsetX += deltaX * scale * .8;
            cameraOffsetY += deltaY * scale * .8;

            if (cameraOffsetX > scale * app.width - app.width) {
                cameraOffsetX = scale * app.width - app.width;
            } else if (cameraOffsetX < 0) {
                cameraOffsetX = 0;
            }
            if (cameraOffsetY > scale * app.height - app.height) {
                cameraOffsetY = scale * app.height - app.height;
            } else if (cameraOffsetY < 0) {
                cameraOffsetY = 0;
            }

            update_screen = true;
            requestAnimationFrame(renderFunctionSingle);

        }
    }
    window.onmouseup = function () {
        clearInterval(drag);
        _firstcall = true;
        if (!moved){
            var x, y;
            x = mouseX;
            y = mouseY;
            //check for object
            for (i in ob) {
                ob[i].checkClick(x, y);
            }
        }
    }

})();

function renderFunction() {
    renderFunctionSingle();

    requestAnimationFrame(renderFunction);
}
function renderFunctionSingle() {
    if (update_screen) {
        update_screen = false;
        window.app.ctx.resetTransform();
        window.app.ctx.setTransform(scale, 0, 0, scale, 0 - cameraOffsetX, 0 - cameraOffsetY);
        window.app.ctx.clearRect(0, 0, app.width, app.height);
        window.app.ctx.drawImage(app.bg, 0, 0, window.app.width, window.app.height);
        for (i in ob) {
            window.ob[i].drawImageCentered();
        }

    }
}
