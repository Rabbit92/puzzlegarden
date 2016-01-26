var LineDrawer = (function () {
    var autoIncrementID = 0;
    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-container'),
    };

    var svgNS = "http://www.w3.org/2000/svg";

    var CLASS_SELECTED = 'selected';

    /**
     * Class SVGEditor
     * @param {Object} options
     * @returns {new SVGEditor}
     */
    function LineDrawer(options) {

        this.id = ++autoIncrementID;

        this.options = populateDefaults(options || {}, defaultOptions);

        this.points = [];

        var module = this;
        this.zoom = function(val){
            return module.options.zoom.value(val);
        };

        this.offsetX = function(val){
            return val+module.options.zoom.offsetX;
        };
        this.offsetY = function(val){
            return val+module.options.zoom.offsetY;
        };

        _p.init.call(this);
    }

    LineDrawer.prototype.addPoint = function (x, y, atEnd) {
        var point = {
            x: x, y: y,
            type: 'L',
            polygon: this
        };

        if (this.points.length < 3 || atEnd) {
            this.points.push(point);
        } else {
            // find closest pair of points
            var smallestDistance = Infinity;
            var current = {p1: this.points[0], p2: this.points[1], i: 0};

            for (var i = 0; i < this.points.length; i++) {
                var pi = this.points[i];
                var j = i + 1;
                if (j >= this.points.length) {
                    j = 0;
                }
                var pj = this.points[j];

                var currentDistance = pointToSegmentDistance(point, pi, pj);

                if (smallestDistance > (currentDistance)) {
                    smallestDistance = (currentDistance);
                    current.p1 = pi;
                    current.p2 = pj;
                    current.i = j;
                }
            }

            this.points.splice(current.i, 0, point);
        }

        _p.normalizePoints.call(this);

        this.redraw();

        return point;
    };

    LineDrawer.prototype.addTempoint = function (x, y) {
        var point = {
            x: x, y: y,
            type: 'L',
            polygon: this
        };

        if (this.points.length < 3) {
            return point;
        } else {
            // find closest pair of points
            var smallestDistance = Infinity;
            var current = {p1: this.points[0], p2: this.points[1], i: 0};

            for (var i = 0; i < this.points.length; i++) {
                var pi = this.points[i];
                var j = i + 1;
                if (j >= this.points.length) {
                    j = 0;
                }
                var pj = this.points[j];

                var currentDistance = pointToSegmentDistance(point, pi, pj);

                if (smallestDistance > (currentDistance)) {
                    smallestDistance = (currentDistance);
                    current.p1 = pi;
                    current.p2 = pj;
                    current.i = j;
                }
            }

            if (smallestDistance < 10) {
                return point;
            }
        }

        return false;
    };

    LineDrawer.prototype.deselect = function () {
        this.domPath.classList.remove(CLASS_SELECTED);
    };

    LineDrawer.prototype.getArea = function () {
        var doubleArea = 0;
        var j = this.points.length - 1;

        for (var i = 0; i < this.points.length; i++) {
            var p1 = this.points[i];
            var p2 = this.points[j];

            doubleArea += (p1.x + p2.x) * (p2.y - p1.y);
            j = i;
        }

        return Math.abs(doubleArea / 2) / 10000;
    };
    LineDrawer.prototype.getPrice = function () {
        if (!this.soil) {
            return 0;
        }

        var soilPrice = this.soil.price;
        if ('number' !== typeof (soilPrice)) {
            try {
                soilPrice = parseFloat(soilPrice);
            } catch (_) {
                soilPrice = 0;
            }
        }

        if (0 == soilPrice) {
            return 0;
        }

        var area = this.getArea();

        return area * soilPrice;
    };

    LineDrawer.prototype.getSoil = function () {
        return this.soil;
    };

    LineDrawer.prototype.redraw = function () {
        if (this.points.length < 1) {
            return;
        }

        var polygon = this;

        var strPolyPoints = 'M';
        var strOutlinePoints = 'M';
        var lastOutline = 'M';

        var pointDesc = function(point) {
            return "" + polygon.offsetX(polygon.zoom(point.x)) + ' ' + polygon.offsetY(polygon.zoom(point.y));
        };

        if (this.points.length >= 3) {
            var firstPoint = this.points[0];
            if ('Q' == firstPoint.type) {
                var lastPoint = this.points[this.points.length - 1];
                strOutlinePoints += pointDesc(lastPoint);
            }
        }

        this.points.forEach(function (point) {
            if (strOutlinePoints.length > 1) {

                if ('Q' === point.type) {
                    strOutlinePoints += point.type;
                } else if ('Q' == lastOutline){
                    strOutlinePoints += ',' + pointDesc(point) + 'T';
                } else {
                    strOutlinePoints += 'L';
                }
                lastOutline = point.type;
            }

            if (strPolyPoints.length > 1) {
                strPolyPoints += 'L';
            }

            strPolyPoints += pointDesc(point);
            strOutlinePoints += pointDesc(point);
        });

        if ('Q' == lastOutline){
            var point = this.points[0];
            strOutlinePoints += ',' + pointDesc(point);
        }

        strPolyPoints += 'Z';
        strOutlinePoints += 'Z';

        this.domPath.setAttribute('d', strPolyPoints);
        this.domOutline.setAttribute('d', strOutlinePoints);

    };

    LineDrawer.prototype.removePolygon = function (point) {
        this.domPath.parentNode.removeChild(this.domPath);
        this.domOutline.parentNode.removeChild(this.domOutline);
    };

    LineDrawer.prototype.removePoint = function (point) {
        var pos = this.points.indexOf(point);
        if (pos >= 0) {
            this.points.splice(pos, 1);
        }

        this.redraw();
    };

    LineDrawer.prototype.select = function () {
        var paths = this.domSVG.querySelectorAll('path');

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (path === this.domOutline || path === this.domPath) {
                path.classList.add(CLASS_SELECTED);
            } else {
                path.classList.remove(CLASS_SELECTED);
            }
        }
    };

    LineDrawer.prototype.setBackground = function (soil) {
        var perimeter = this;
        var soilId = 'materialPattern' + soil.id;

        perimeter.domOutline.style.fill = 'url(#' + soilId + ')';

        this.soil = soil;
    };

    LineDrawer.prototype.toggleRoundPoint = function (point) {
        if (this.points.length < 3) {
            return 'L';
        }
        _p.normalizePoints.call(this);
        var prevIndex = point.index - 1;
        if (prevIndex < 1) prevIndex = this.points.length -1;
        var prevPoint = this.points[prevIndex];
        if ('Q' === prevPoint.type) {
            return 'L';
        }

        var nextIndex = point.index + 1;
        if (nextIndex >= this.points.length) nextIndex = 0;
        var nextPoint = this.points[nextIndex];
        if ('Q' === nextPoint.type) {
            return 'L';
        }

        point.type = ('Q' === point.type) ? 'L' : 'Q';

        return point.type;
    };

    /**
     * Private methods
     * @type Object
     */
    var _p = {
        init: function () {
            var polygon = this;

            this.domSVG = this.options.domContainer.querySelector('svg');
            if (!this.domSVG) {
                this.domSVG = document.createElementNS(svgNS, 'svg');

                this.options.domContainer.appendChild(this.domSVG);
            }

            this.domOutline = document.createElementNS(svgNS, 'path');
            this.domSVG.appendChild(this.domOutline);
            this.domOutline.classList.add('outline');

            this.domPath = document.createElementNS(svgNS, 'path');
            this.domSVG.appendChild(this.domPath);
            this.domPath.classList.add('perimeter')
            this.domPath.fill = 'transparent';

            this.patern = document.createElementNS(svgNS, 'pattern');
            this.patern.id = 'materialPatern' + this.id;
            this.patern.x = 'materialPatern' + this.id;
        },
        normalizePoints: function(){
            if (this.points.length >= 3) {
                var firstPoint = this.points[0];
                var lastPoint = this.points[this.points.length - 1];

                if ('Q' == lastPoint.type) {
                    this.points.unshift(this.points.pop());
                }
            }
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].index = i;
            }
        }
    };

    return LineDrawer;
}());