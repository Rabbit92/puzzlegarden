/*
 *  Unless otherwise specified, this is closed-source. Copying without permission is prohibited and may result in legal action with or without this license header
 */

/* global KEYCODE */

var ZoomController = (function () {

    var MAX_ZOOM = 1500;
    var MIN_ZOOM = 0;

    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-zoom')
    };

    /**
     * Class ZoomController
     * @param {Object} options
     * @returns {new ZoomController}
     */
    function ZoomController(options) {
        this.options = populateDefaults(options || {}, defaultOptions);

        this.zoom = 100;
        this.pxpcm = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        _p.init.call(this);
    }

    ZoomController.prototype.value = function (val) {
        return val * (this.zoom / 100);
    };

    ZoomController.prototype.restore = function (val) {
        return (val / (this.zoom)) * 100;
    };

    ZoomController.prototype.zoomDelta = function (direction, center) {
        if (undefined === center) {
            center = {
                x: $(window).width() / 2,
                y: $(window).height() / 2
            }
        }
        var controller = this;
        var oldZoom = controller.zoom;
        controller.zoom += direction;

        if (controller.zoom < MIN_ZOOM) {
            controller.zoom = MIN_ZOOM;
        }
        else if (controller.zoom > MAX_ZOOM) {
            controller.zoom = MAX_ZOOM;
        }

        var factor = 1 - (controller.zoom) / oldZoom;
        controller.offsetX += (center.x - controller.offsetX) * factor;
        controller.offsetY += (center.y - controller.offsetY) * factor;

        _p.normalizeOffsets.call(this);

        $(controller.options.puzzle).
                trigger('zoom.gardenpuzzle');
    };

    ZoomController.prototype.zoomIn = function () {
        return this.zoomDelta(5);
    };

    ZoomController.prototype.zoomOut = function () {
        return this.zoomDelta(-5);
    };

    ZoomController.prototype.getMaxZoom = function() {
        return MAX_ZOOM;
    };

    ZoomController.prototype.getOffset = function() {
        return {
            top: this.offsetY,
            left: this.offsetX
        };
    };

    /**
     * Private methods
     * @type Object
     */
    var _p = {
        init: function () {
            var controller = this;
            //////
            // Calculate the initial zoom, based on garden Container
            var domContainer = controller.options.puzzle.options.domContainer;
            var base = Math.min(domContainer.clientHeight, domContainer.clientWidth)
            this.pxpcm = (base) / 2500;
            this.zoom = 100 * (base / 2500);
            MAX_ZOOM = 100 * (base / 1000);
            MIN_ZOOM = 100 * (base / 7000);

            ///////////////
            $(controller.options.domContainer).
                    on('click', '[data-zoom]', function (ev) {
                        var btn = ev.currentTarget;

                        var direction = 1;

                        if ('out' === btn.dataset.zoom) {
                            direction = -1;
                        }
                        controller.zoomDelta(direction * 5);
                    });

            // detect available wheel event
            var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

            var onMouseWheel = function (jqEv) {
                var ev = jqEv.originalEvent;
                var deltaY = 0;
                if (wheelEvent === "mousewheel") {
                    deltaY = -1 / 40 * ev.wheelDelta;
                }
                else {
                    deltaY = ev.deltaY < 0 ? -1 : (ev.deltaY > 0 ? 1 : 0);
                }
                controller.zoomDelta(deltaY * -controller.value(10), {
                    x: ev.pageX - domContainer.offsetLeft,
                    y: ev.pageY - domContainer.offsetTop
                });
            };

            $(domContainer).
                    on(wheelEvent, function () {
                        onMouseWheel.apply(controller, arguments);
                    });
            ////////////////////////
            // Pinch to zoom
            interact(domContainer)
                .gesturable({
                    onmove: function (event) {
                        controller.zoomDelta((event.ds)*40);
                    }

                });

            ////////////////////////
            // Offsets

            var keyPressed = {};
            var onKeyPress = function() {
                Object.keys(keyPressed).forEach(function(keyCode) {
                    if (KEYCODE.UP == keyCode) {
                        controller.offsetY += 10;
                        _p.normalizeOffsets.call(controller);
                    }
                    else if (KEYCODE.DOWN == keyCode) {
                        controller.offsetY -= 10;
                        _p.normalizeOffsets.call(controller);
                    }
                    else
                    if (KEYCODE.LEFT == keyCode) {
                        controller.offsetX += 10;
                        _p.normalizeOffsets.call(controller);
                    }
                    else if (KEYCODE.RIGHT == keyCode) {
                        controller.offsetX -= 10;
                        _p.normalizeOffsets.call(controller);
                    }

                });

                $(controller.options.puzzle).
                        trigger('zoom.gardenpuzzle');

            }
            $(document).
                    on('keydown', function (ev) {
                        keyPressed[ev.keyCode] = true;
                        onKeyPress.call(controller);
                    }).
                    on('keyup', function (ev) {
                        delete(keyPressed[ev.keyCode]);
                    });
            interact(domContainer)
                .draggable({
                    onmove: function (event) {
                        controller.offsetX += event.dx;
                        controller.offsetY += event.dy;
                        _p.normalizeOffsets.call(controller);
                        $(controller.options.puzzle).trigger('zoom.gardenpuzzle');
                    }

                })
        },

        normalizeOffsets: function () {
            var maxSize = this.value(7000);
            var $window = $(this.options.puzzle.options.domContainer);
            var winWidth = $window.width();
            var winHeight = $window.height();

            var minX = -(maxSize - winWidth);
            var maxX = (maxSize - winWidth);

            if (minX < maxX) {
                if (this.offsetX < minX) {
                    this.offsetX = minX;
                } else if (this.offsetX > maxX) {
                    this.offsetX = maxX;
                }
            } else {
                this.offsetX = 0;
            }

            var minY = -(maxSize - winHeight);
            var maxY = (maxSize - winHeight);

            if (minY < maxY) {
                if (this.offsetY < minY) {
                    this.offsetY = minY;
                } else if (this.offsetY > maxY) {
                    this.offsetY = maxY;
                }
            } else {
                this.offsetY = 0;
            }
        }
    };

    return ZoomController;
}());