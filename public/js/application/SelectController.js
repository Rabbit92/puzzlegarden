/*
 *  Unless otherwise specified, this is closed-source. Copying without permission is prohibited and may result in legal action with or without this license header
 */

/* global KEYCODE */

var SelectController = (function () {

    var autoIncrement = 0;

    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-select')
    };

    /**
     * Class SelectController
     * @param {Object} options
     * @returns {new SelectController}
     */
    function SelectController(options) {
        this.options = populateDefaults(options || {}, defaultOptions);

        this.selectables = {};

        _p.init.call(this);
    }

    SelectController.prototype.createGlyphiconButton = function (glyphicon) {
        var btn = document.createElement('button');
        btn.innerHTML = '<i class="glyphicon glyphicon-' + glyphicon + '"></i>';

        $(btn).
            hide();

        $(this.options.domContainer).
            append(btn);

        return btn;
    };

    SelectController.prototype.createIconButton = function (glyphicon) {
        var btn = document.createElement('button');
        btn.innerHTML = '<i class="icon icon-' + glyphicon + '"></i>';

        $(btn).hide();

        $(this.options.domContainer).
            append(btn);

        return btn;
    };

    SelectController.prototype.registerSelectable = function (selectable) {
        autoIncrement++;

        this.selectables[autoIncrement] = selectable;

        _p.selectableEvents.call(this, selectable);
    };

    /**
     * Private methods
     * @type Object
     */
    var _p = {
        init: function () {
            var controller = this;
            controller.selected = 0;
        },
        selectableEvents: function (selectable) {
            var controller = this;
            var $container = $(controller.options.domContainer);
            var pos = {
                x: 0,
                y: 0
            };

            var pizzaPoints = [];

            interact(selectable).on('tap', function(ev) {
                ev.stopPropagation();
                if (controller.selected) {
                    $(controller.selected).trigger('hide-options.select.puzzle');
                }

                controller.selected = ev.currentTarget;

                pos = {x: ev.clientX, y: ev.clientY};

                $(selectable).
                trigger('get-options.select.puzzle', [pos]);
            });

            $(selectable)
                .on('open.select.puzzle', function (ev) {
                ev.stopPropagation();
                if (controller.selected) {
                    $(controller.selected).
                    trigger('hide-options.select.puzzle');
                }

                controller.selected = ev.currentTarget;
                var $target = $(ev.currentTarget)
                var offset = $target.offset();

                pos = {x: offset.left + $target.width() / 2, y: offset.top + $target.height() / 2};

                $(selectable).
                trigger('get-options.select.puzzle', [pos]);
            })
                .on('response.get-options.select.puzzle', function (ev, modules) {
                    $container.show().
                        offset({
                            top: pos.y,
                            left: pos.x
                        });

                    var $visible = $container.children('button:visible');
                    var $center = $visible.first();
                    var $flower = $visible.not($visible.first());

                    $visible.offset({
                        top: pos.y - $center.outerHeight() / 2,
                        left: pos.x - $center.outerWidth() / 2
                    });
                    pizzaPoints = pizzaSlice({x: 0, y: 0}, $flower, $center.width() * 2);
                    for (var i = 0; i < pizzaPoints.length; i++) {
                        var point = pizzaPoints[i];
                        var petal = $flower.get(i);
                        var $petal = $(petal)
                        point.dom = petal;
                        $petal.animate({
                            top: "+=" + point.y,
                            left: "+=" + point.x,
                        }, 'fast');
//                            $petal.offset({
//                                top: $petal.offset().top + point.y,
//                                left:  $petal.offset().left +point.x,
//                            });
                    }

                    modules.forEach(function (module) {
                        interact(module).on('tap', function (ev) {
                            ev.stopPropagation();
                        });
                    });
                })
                .on('move-options.select.puzzle', function (ev, delta) {
                    var offset = $container.offset();

                    pos.y += delta.dy;
                    pos.x += delta.dx;

                    $container.offset({
                        top: pos.y,
                        left: pos.x
                    });
                });
            $(selectable).each(function (_, el) {
                interact(el).on('tap', function (ev) {
                    ev.stopPropagation();
                });
            });
        }
    };

    return SelectController;
}());

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

function pizzaSlice(center, domElements, minRadius) {
    var n = domElements.length;

    var r = minRadius || 1;

    var points;

    switch (n) {
        case 0:
            return [];
        case 1:
            points = [{
                x: center.x + r,
                y: center.y,
                el: domElements[0]
            }];
            break;
        case 2:
            return [{
                x: center.x + r,
                y: center.y,
                el: domElements[0]
            }, {
                x: center.x - r,
                y: center.y,
                el: domElements[1]
            }];
        default:
            var sliceLen = 2 * Math.PI / n;

            points = [];

            for (var i = 0; i < n; i++) {
                var angle = i * sliceLen;
                var el = domElements[i];

                var hide = false;

                if ('none' == el.style.display) {
                    el.style.display = 'inline-block';
                    hide = true;
                }

                points.push({
                    x: center.x + r * Math.cos(angle),
                    y: center.y + r * Math.sin(angle),
                    cr: r,
                    radius: Math.max(el.clientWidth, el.clientHeight) / 2,
                    angle: angle,
                    el: el
                });

                if (hide) {
                    el.style.display = 'none';
                }

            }

            do {
                var wasAdjusted = false;
                points.forEach(function (currentPoint, i) {
                    var j = i + 1;
                    if (j >= points.length) {
                        j = 0;
                    }

                    var nextPoint = points[j];

                    var distance = Math.sqrt(Math.pow(currentPoint.x - nextPoint.x, 2) + Math.pow(currentPoint.y - nextPoint.y, 2));
                    var minDistance = currentPoint.radius + nextPoint.radius;

                    if (distance < minDistance) {

                        var adjustmentStep = Math.random() * 20 + 30;// [20, 30]

                        if (Math.random() < 0.5) {
                            currentPoint.cr += adjustmentStep;
                            currentPoint.x = center.x + currentPoint.cr * Math.cos(currentPoint.angle);
                            currentPoint.y = center.y + currentPoint.cr * Math.sin(currentPoint.angle);

                        } else {
                            nextPoint.cr += adjustmentStep;
                            nextPoint.x = center.x + nextPoint.cr * Math.cos(nextPoint.angle);
                            nextPoint.y = center.y + nextPoint.cr * Math.sin(nextPoint.angle);
                        }


                        wasAdjusted = true;
                    }

                });
            } while (wasAdjusted);

    }


    return points;
}