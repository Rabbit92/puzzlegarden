/* global interact */

var PerimeterController = (function () {
    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        puzzle: null
    };

    var draggingPointRadius = 10;

    var NAME = 'soils';

    /**
     * Class PerimeterController
     * @param {Object} options
     * @returns {new PerimeterController}
     */
    function PerimeterController(options) {
        this.options = populateDefaults(options, defaultOptions);
        /**
         * Polygons
         */
        this.polygons = {};

        this.snapSize = 10;
        var module = this;

        this.zoomer = module.options.zoom;

        this.zoom = function(val){
            return module.options.zoom.value(val);
        };
        this.unzoom = function(val){
            return module.options.zoom.restore(val);
        };

        this.offsetX = function(val){
            return val+module.options.zoom.offsetX;
        };
        this.offsetY = function(val){
            return val+module.options.zoom.offsetY;
        };

        _p.init.call(this);

    }

    PerimeterController.prototype.events = {
    };

    PerimeterController.prototype.getName = function () {
        return NAME;
    };

    PerimeterController.prototype.getPrice = function () {
        var price = 0;

        for (var id in this.polygons) {
            price += this.polygons[id].getPrice();
        }

        return price;
    };

    PerimeterController.prototype.getPricedObjects = function () {
        var objects = {};

        for (var id in this.polygons) {
            var polygon = this.polygons[id];
            var soil = polygon.getSoil();
            if (!soil) {
                continue;
            }

            var bgID = soil.id;

            if (isset(objects[bgID])) {
                objects[bgID].price += polygon.getPrice();
                objects[bgID].quantity += polygon.getArea();
                continue;
            }

            objects[bgID] = {
                name: soil.name,
                image: '<img src="' + cropImageURL(soil.top_image_hash, {
                    width: 100,
                    height: 100
                }) + '">',
                quantity: polygon.getArea(),
                price: polygon.getPrice(),
                unit: 'm<sup>2</sup>'
            };
        }

        return objects;
    };

    PerimeterController.prototype.snapPoint = function (point) {
        var snap = {
            x: point.x,
            y: point.y,
        };

        var snapSize = this.snapSize;

        var modX = snap.x % snapSize;

        if (modX < (snapSize / 2)) {
            snap.x -= modX;
        } else {
            snap.x += snapSize - modX;
        }

        var modY = snap.y % snapSize;

        if (modY < (snapSize / 2)) {
            snap.y -= modY;
        } else {
            snap.y += snapSize - modY;
        }

        return snap;
    };

    PerimeterController.prototype.serialize = function () {
        var simplePolygons = [];

        for (var id in this.polygons) {
            var polygon = this.polygons[id];
            var simplePoints = [];

            polygon.points.forEach(function (point) {
                simplePoints.push([point.x, point.y, point.type]);
            });

            simplePolygons.push({
                p: simplePoints,
                s: (polygon.soil || {}).id
            });
        }
        return simplePolygons;
    };

    /**
     * Private methods
     * @this PerimeterController
     */
    var _p = {
        init: function () {
            var controller = this;
            var domContainer = this.options.puzzle.options.domContainer;
            _p.zoom.call(controller);
            // _p.createPolygon.call(this);

            _p.createToolbar.call(this);

            _p.load.call(this);

            $(this.options.puzzle).on('zoom.gardenpuzzle', function() {
                _p.zoom.call(controller);
            });

            interact(domContainer)
                .on('tap', function (ev) {
                    if ('mouse' == ev.pointerType) {
                        return;
                    }
                    if (!controller.polygon) {
                        _p.createPolygon.call(controller);
                    }

                    var x = controller.unzoom(ev.pageX - domContainer.offsetLeft - controller.offsetX(1));
                    var y = controller.unzoom(ev.pageY - domContainer.offsetTop - controller.offsetY(1));

                    var point = controller.polygon.addPoint(x, y);
                    _p.createDragPoint.call(controller, point);
                });
            domContainer.addEventListener('mousemove', function (ev) {
                if (!controller.polygon) {
                    _p.createPolygon.call(controller);
                }

                var x = controller.unzoom(ev.pageX - domContainer.offsetLeft - controller.offsetX(1));
                var y = controller.unzoom(ev.pageY - domContainer.offsetTop - controller.offsetY(1));

                _p.createTemPoint.call(controller, x, y);
            });
        },
        bringToFront: function (domElement) {
            domElement.parentElement.appendChild(domElement);
        },
        createDragPoint: function (point) {
            var module = this;
            point.dom = document.createElement('span');
            point.dom.style.position = 'absolute';
            var $point = $(point.dom);
            this.options.puzzle.options.domContainer.appendChild(point.dom);
            var snap = this.snapPoint(point);
            point.x = snap.x;
            point.y = snap.y;

            _p.updatePoint.call(this, point);
            point.dom.classList.add('drag-point');

            module.options.select.registerSelectable(point.dom);

            var userButtons = [];
            var mover = module.options.select.createIconButton('move');
            userButtons.push(mover);

            mover.title = "Trage pentru a muta colțul";

            interact(mover).draggable({
                onstart: function () {
                    $(userButtons).not(mover).fadeOut('slow');
                },
                onmove: function (event) {
                    event.stopPropagation();

                    point.x += module.unzoom(event.dx);
                    point.y += module.unzoom(event.dy);

                    $point.trigger('move-options.select.puzzle', [{
                        dx: (event.dx),
                        dy: (event.dy)
                    }]);

                    _p.updatePoint.call(module, point);
                },
                onend: function() {
                    $(userButtons).not(mover).fadeIn('slow');

                    var snap = module.snapPoint(point);

                    point.x = snap.x;
                    point.y = snap.y;

                    _p.updatePoint.call(module, point);
                    $(module.options.puzzle.options.domContainer).trigger('update.price', [module]);
                }
            });

            interact(mover).on('tap', function() {
                $(userButtons).fadeToggle('fast', function() {
                    $point.trigger('hide-options.select.puzzle');
                });
            });

            var deleter = module.options.select.createIconButton('bin');
            userButtons.push(deleter);

            deleter.title = "Apasă pentru a șterge colțul";

            interact(deleter).on('tap', function () {
                _p.deleteDragPoint.call(module, point);

                $point.trigger('hide-options.select.puzzle');

                userButtons.forEach(function(btn){
                    $(btn).remove();
                });
            });

            var rounder = module.options.select.createIconButton('coltrotund');
            userButtons.push(rounder);

            var originalRounderTitle = rounder.title = "Apasă pentru a face colț rotund";

            interact(rounder).on('tap', function () {
                _p.toggleRoundPoint.call(module, point);
                if ('Q' === point.type) {
                    rounder.title = "Apasă pentru a face colț ascuțit";
                } else {
                    rounder.title = originalRounderTitle;
                }
            });

            var onClick = function (ev) {
                ev.stopPropagation();
            };
            var onDblClick = function (ev) {
                ev.stopPropagation();
            };
            var onMouseMove = function (ev) {
                ev.stopPropagation();
            };

            // interact(point.dom).on('tap', onClick);
            point.dom.addEventListener('click', onClick);

            // interact(point.dom).on('doubletap', onDblClick);
            point.dom.addEventListener('dblclick', onDblClick);
            point.dom.addEventListener('mousemove', onMouseMove);


            $point.on('get-options.select.puzzle', function(ev, pos) {
                _p.selectPolygon.call(module, point.polygon.id);
                userButtons.forEach(function(btn){
                    $(btn).show();
                });
                $point.trigger('response.get-options.select.puzzle', [userButtons]);
            }).on('hide-options.select.puzzle', function() {
                $(userButtons).hide();
                _p.deselectPolygon.call(module, point.polygon.id);
            });

            $(this.options.puzzle).on('zoom.gardenpuzzle', function () {
                $point.trigger('hide-options.select.puzzle');
            });

            userButtons.forEach(function(btn){
                $(btn).on('click', function(ev) {
                    ev.stopPropagation();
                });
            });

            return point;
        },
        createPolygon: function () {
            var module = this;
            var polygon = this.polygon = new LineDrawer({
                puzzle: this.options.puzzle,
                zoom: this.options.zoom,
                domContainer: document.getElementById('garden-container'),
            });
            var $path = $(polygon.domPath);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            module.options.select.registerSelectable(polygon.domPath);

            var userButtons = [];
            var mover = module.options.select.createIconButton('move');
            userButtons.push(mover);

            mover.title = "Trage pentru a muta perimetrul";

            interact(mover).draggable({
                onstart: function () {
                    $(userButtons).not(mover).fadeOut('slow');
                    // bring to front
                    _p.bringToFront(polygon.domPath);
                    _p.selectPolygon.call(module, polygon.id);
                },
                onmove: function (event) {
                    polygon.points.forEach(function (point) {
                        point.x += module.unzoom(event.dx);
                        point.y += module.unzoom(event.dy);
                        _p.updatePoint.call(module, point, true);
                    });
                    polygon.redraw();

                    $path.trigger('move-options.select.puzzle', [{
                        dx: (event.dx),
                        dy: (event.dy)
                    }]);
                },
                onend: function () {
                    $(userButtons).not(mover).fadeIn('slow');

                    polygon.points.forEach(function (point) {
                        var snap = module.snapPoint(point);
                        point.x = snap.x;
                        point.y = snap.y;
                        _p.updatePoint.call(module, point, true);
                    });
                    polygon.redraw();
                }
            });

            interact(mover).on('tap', function () {
                $(userButtons).fadeToggle('fast', function () {
                    $path.trigger('hide-options.select.puzzle');
                });
            });

            var deleter = module.options.select.createIconButton('bin');
            userButtons.push(deleter);

            deleter.title = "Apasă pentru a șterge colțul";

            interact(deleter).on('tap', function () {

                while (polygon.points.length > 0) {
                    _p.deleteDragPoint.call(module, polygon.points.shift());

                }

                _p.deletePolygon.call(module, polygon);

                $path.trigger('hide-options.select.puzzle');

                userButtons.forEach(function (btn) {
                    $(btn).remove();
                });
            });


            var onClick = function (ev) {
                ev.stopPropagation();
                // bring to front
                _p.bringToFront(polygon.domPath);
                _p.selectPolygon.call(module, polygon.id);
            };
            var onDblClick = function (ev) {
                ev.stopPropagation();
            };
            var onMouseMove = function (ev) {
                if (polygon.domPath.classList.contains('selected')) {
                    return;
                }

                ev.stopPropagation();

            };

            polygon.domPath.addEventListener('click', onClick);
            polygon.domPath.addEventListener('dblclick', onDblClick);
            polygon.domPath.addEventListener('mousemove', onMouseMove);


            $path.on('get-options.select.puzzle', function (ev, pos) {
                _p.selectPolygon.call(module, polygon.id);
                userButtons.forEach(function (btn) {
                    $(btn).show();
                });
                $path.trigger('response.get-options.select.puzzle', [userButtons]);
            }).on('hide-options.select.puzzle', function () {
                $(userButtons).hide();
                _p.deselectPolygon.call(module, polygon.id);
            });

            $(userButtons).on('click', function (ev) {
                ev.stopPropagation();
            });

            $(this.options.puzzle).on('zoom.gardenpuzzle', function () {
                $path.trigger('hide-options.select.puzzle');
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

            this.polygons[polygon.id] = polygon;
            _p.selectPolygon.call(this, polygon.id);

            return polygon;
        },
        createTemPoint: function (x, y) {
            var controller = this;

            var point = controller.polygon.addTempoint(x, y);
            var domTemPoint;

            if (!this.domTemPoint) {
                domTemPoint = document.createElement('span');
                domTemPoint.classList.add('drag-point');
                domTemPoint.classList.add('temp');
                domTemPoint.style.position = 'absolute';
                this.options.puzzle.options.domContainer.appendChild(domTemPoint);

                domTemPoint.style.width = domTemPoint.style.height = '' + (draggingPointRadius * 2 + 1) + 'px';

                interact(domTemPoint).on('tap', function (event) {
                    event.stopPropagation();
                    if ('mouse' == event.pointerType && 0 != event.button) {
                        // Skip unless left button was pressed
                        return;
                    }

                    var tempoint = $(domTemPoint).data('point');
                    var point = controller.polygon.addPoint(tempoint.x, tempoint.y);
                    _p.createDragPoint.call(controller, point);
                    $(point.dom).trigger('open.select.puzzle');

                    domTemPoint.style.display = 'none';
                    $(domTemPoint).removeData('point');
                });

                domTemPoint.addEventListener('click', function (event) {
                    event.stopPropagation();
                });

                this.domTemPoint = domTemPoint;
            } else {
                domTemPoint = this.domTemPoint;
            }

            if (point) {
                var snap = this.snapPoint(point);
                point.x = snap.x;
                point.y = snap.y;
                domTemPoint.style.display = 'block';
                domTemPoint.style.top = this.offsetY(this.zoom(point.y) - draggingPointRadius) + 'px';
                domTemPoint.style.left = this.offsetX(this.zoom(point.x) - draggingPointRadius) + 'px';
                $(domTemPoint).data('point', point);
            } else {
                domTemPoint.style.display = 'none';
                $(domTemPoint).removeData('point');
            }

        },
        createToolbar: function () {
            var module = this;
            var buttonContainer = document.getElementById('module-buttons');
            module.soilById = {};

            SoilTypes.forEach(function (soil) {
                var btn = document.createElement('button');
                btn.textContent = soil.name;
                buttonContainer.appendChild(btn);

                btn.addEventListener('click', function () {
                    module.polygon.setBackground(soil);
                    _p.save.call(module);
                    $(module.options.puzzle.options.domContainer).trigger('update.price', [module]);
                });
                module.soilById[soil.id] = soil;
            });

            var newPolyBtn = document.createElement('button');
            newPolyBtn.textContent = "Perimetru nou";
            buttonContainer.appendChild(newPolyBtn);

            newPolyBtn.addEventListener('click', function () {
                module.polygon.deselect();
                _p.deselectPolygon.call(module);
                module.polygon = null;
            });

        },
        deleteDragPoint: function (point) {
            point.polygon.removePoint(point);
            interact(point.dom).unset();
            point.dom.parentNode.removeChild(point.dom);
            _p.save.call(this);
            $(this.options.puzzle.options.domContainer).trigger('update.price', [this]);
        },
        deletePolygon: function (polygon) {
            interact(polygon.domPath).unset();
            polygon.removePolygon();

            delete(this.polygons[polygon.id]);
            this.polygon = null;
            _p.save.call(this);
            $(this.options.puzzle.options.domContainer).trigger('update.price', [this]);
        },
        /**
         *
         */
        deselectPolygon: function () {
            $(this.options.puzzle.options.domContainer.querySelectorAll('.drag-point')).hide();
            this.polygon = null;
        },
        load: function () {
            if (!localStorage.polygons) {
                return;
            }
            var polygons = [];
            try {
                polygons = JSON.parse(localStorage.polygons);
            } catch (ex) {
                return;
            }

            var module = this;

            polygons.forEach(function (poly) {
                var polygon = _p.createPolygon.call(module);

                poly.p.forEach(function (p) {
                    var point = polygon.addPoint(p[0], p[1], true);
                    point.type = p[2];
                    _p.createDragPoint.call(module, point);
                });

                if (poly.s && isset(module.soilById[poly.s])) {
                    polygon.setBackground(module.soilById[poly.s]);
                }
            });
            $(module.options.puzzle.options.domContainer).trigger('update.price', [module]);
        },
        toggleRoundPoint: function(point) {
            var module = this;
            point.polygon.toggleRoundPoint(point);
            _p.updatePoint.call(module, point);
        },
        save: function () {
            var simplePolygons = this.serialize();

            localStorage.polygons = JSON.stringify(simplePolygons);
        },

        /**
         *
         * @param polygonID
         */
        selectPolygon: function (polygonID) {
            _p.deselectPolygon.call(this);

            if (isset(this.polygons[polygonID])) {
                this.polygon = this.polygons[polygonID];
                this.polygon.select();

                for (var i = 0; i < this.polygon.points.length; i++) {
                    var point = this.polygon.points[i];

                    $(point.dom).show();
                }
            }
        },
        updatePoint: function (point, skipRedraw) {
            if (!skipRedraw) {
                this.polygon.redraw();
            }

            var snap = this.snapPoint(point);

            point.dom.style.width = point.dom.style.height = '' + (draggingPointRadius * 2 + 1) + 'px';
            point.dom.style.top = this.offsetY(this.zoom(point.y) - draggingPointRadius) + 'px';
            point.dom.style.left = this.offsetX(this.zoom(point.x) - draggingPointRadius) + 'px';

            if ('Q' === point.type) {
                point.dom.classList.add('round');
            } else {
                point.dom.classList.remove('round');
            }

            _p.save.call(this);
        },
        zoom: function() {
            var module = this;

            for (var id in module.polygons) {
                var polygon = module.polygons[id];

                polygon.points.forEach(function(point) {
                    _p.updatePoint.call(module, point, true);
                });
                polygon.redraw();
            }

            SoilTypes.forEach(function (soil) {
                var pattern = document.getElementById('materialPattern' + (soil.id));
                var img = pattern.querySelector('image');

                pattern.setAttribute('width', this.zoom(soil.top_image.width));
                img.setAttribute('width', this.zoom(soil.top_image.width));
                pattern.setAttribute('height', this.zoom(soil.top_image.height));
                img.setAttribute('height', this.zoom(soil.top_image.height));
            }, this);

            var bg = document.getElementById('gridPattern');
            var bgRect = document.getElementById('bgRectangle');

            var gridWidthNum = this.zoom(500);
            var gridWidth = gridWidthNum.toFixed();
            bg.innerHTML = '';

            var minX = Math.min(0, this.offsetX(0));
            var minY = Math.min(0, this.offsetY(0));

            // make it true when small grid is 1m
            var meterStage = false;

            for (var i = 0; i < 500 ; i+=50) {
                var z = this.zoom(i).toFixed();
                if (0 < z && z < 10) {
                    break;
                }

                if (!meterStage) {
                    if (0 < z && z <= 20) {
                        meterStage = true;
                    }
                }

                if (meterStage) {
                    if (0 != i%100) {
                        continue;
                    }
                }


                bg.innerHTML+= '<path d="M'+z+' 0L'+z+' '+gridWidth+'" class="path10cm" />';
                bg.innerHTML+= '<path d="M0 '+z+'L'+gridWidth+' '+z+'" class="path10cm" />';
            }
            bg.innerHTML+= '<rect x="0" y="0" width="'+gridWidth+'" height="'+gridWidth+'" class="rect1m" />';
            bg.setAttribute('width', gridWidth);
            bg.setAttribute('height', gridWidth);

            var translateVal = function(v) {
                if (v >= 0) {
                    var out = v - Math.floor(v/gridWidthNum)*gridWidthNum;
                    return out - gridWidthNum;
                } else {
                    var abs = Math.abs(v)
                    var out = abs - Math.floor(abs/gridWidthNum)*gridWidthNum;
                    return -out;
                }
            };
            $(bgRect).css('transform', 'translateX('+translateVal(this.offsetX(0))+'px) translateY('+translateVal(this.offsetY(0))+'px)');

            var domContainer = this.options.puzzle.options.domContainer;
            var domWorkBG = document.getElementById('garden-background').querySelector('svg');
            domContainer.style.maxWidth =
            domWorkBG.style.maxWidth = (this.zoom(7000) + this.zoomer.getOffset().left) + 'px';
            domContainer.style.maxHeight =
            domWorkBG.style.maxHeight = (this.zoom(7000) + this.zoomer.getOffset().top) + 'px';
        }
    };

    return PerimeterController;
}());