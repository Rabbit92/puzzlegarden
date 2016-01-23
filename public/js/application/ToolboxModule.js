/* global interact, PUZZLE_URL, IMAGES_URL */

var ToolboxModule = (function () {
    var autoIncrementModuleID = 0;
    var NAME = 'modules';
    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-toolbox'),
        toolContainer: document.getElementById('tool-container'),
    };

    /**
     * Class ToolboxModule
     * @param {Object} options
     * @returns {new ToolboxModule}
     */
    function ModulesEditor(options) {
        /**
         * Puzzle options
         */
        this.options = populateDefaults(options, defaultOptions);

        this.modules = {};

        var controller = this;
        this.zoom = function(val){
            return controller.options.zoom.value(val);
        };
        this.unzoom = function(val){
            return controller.options.zoom.restore(val);
        };

        this.offsetX = function(val){
            return val+controller.options.zoom.offsetX;
        };
        this.offsetY = function(val){
            return val+controller.options.zoom.offsetY;
        };

        _p.init.call(this);
    }

    ModulesEditor.prototype.getName = function () {
        return NAME;
    };

    ModulesEditor.prototype.getPrice = function () {
        var price = 0;

        for (var id in this.modules) {
            if ('number' !== typeof (this.modules[id].db.price)) {
                try {
                    price = parseFloat(this.modules[id].db.price);
                } catch (_) {
                }
            } else {
                price = this.modules[id].db.price;
            }
        }

        return price;
    };

    ModulesEditor.prototype.getPricedObjects = function () {
        var objects = {};

        for (var id in this.modules) {
            var module = this.modules[id].db;
            var modulePrice = 0;
            if ('number' !== typeof (module.price)) {
                try {
                    modulePrice = parseFloat(module.price);
                } catch (_) {
                    modulePrice = 0;
                }
            } else {
                modulePrice = module.price;
            }

            if (isset(objects[module.id])) {
                objects[module.id].price = modulePrice;
                objects[module.id].quantity++;
                continue;
            }

            objects[module.id] = {
                name: 'Modul',
                image: '<img src="' + fitImageURL(module.top_image, {
                    width: 100,
                    height: 100
                }) + '">',
                quantity: 1,
                price: modulePrice,
                unit: ''
            };
        }

        return objects;
    };

    ModulesEditor.prototype.serialize = function () {
        var simpleModules = [];

        for (var id in this.modules) {
            var module = this.modules[id];
            simpleModules.push({
                p: [module.x, module.y],
                m: module.db.id,
                r: module.rotation
            });
        }
        return simpleModules;
    };

    /**
     * Private methods
     * @this ModulesEditor
     */
    var _p = {
        init: function () {
            var editor = this;
            _p.displayLoad.call(this, function () {
                interact('.entity', {
                    context: this.options.domContainer
                }).draggable({
                    onstart: function onDragStart(ev) {
                        var $target = $(ev.target);
                        var entity = $target.data('entity');

                        var offset = $target.offset();
                        offset.top += $target.height()/2;
                        offset.left+= $target.width()/2;

                        var module = _p.createModule.call(editor, entity, offset);
                        $target.data('module', module.id);
                    },
                    onmove: function (ev) {
                        var moduleId = $(ev.target).data('module');
                        if (!moduleId) {
                            return;
                        }

                        var module = editor.modules[moduleId];

                        if (!module) {
                            return;
                        }

                        var containerOffset = $(editor.options.puzzle.options.domContainer).offset();

                        // if (module.loaded) {
                        //    module.x += editor.unzoom(ev.dx);
                        //    module.y += editor.unzoom(ev.dy);
                            module.x = editor.unzoom(ev.pageX - containerOffset.left);
                            module.y = editor.unzoom(ev.pageY - containerOffset.top);
                        // }
                        _p.updateModule.call(editor, module);
                    },
                    onend: function (ev) {
                        $(ev.target).removeData('module');
                    }
                });
                $(this.options.puzzle).on('zoom.gardenpuzzle', function() {
                    _p.zoom.call(editor);
                });
            });

            $('#module-categories')
                .on('click', '.expand-category', function (ev) {
                    var target = ev.currentTarget;

                    if (target.dataset.level < 1) {
                        _p.expandRootCategory.call(editor, target);
                    } else {
                        _p.expandSubCategory.call(editor, target);
                    }
                })
                .on('click', '.fetch-modules', function (ev) {
                    var animationComplete = false, ajaxComplete = false, imgComplete = false;
                    var onComplete;
                    var $clone = null;
                    _p.expandSubCategory.call(editor, ev.currentTarget, function ($c) {
                        animationComplete = true;
                        $clone = $c;
                        onComplete.call(editor);
                    });
                    var $target = $(ev.currentTarget);
                    var category_id = $target.data('category_id');

                    _p.loadEntities.call(editor, {category_id: category_id}, function () {
                        ajaxComplete = true;
                        onComplete.call(editor);
                    });

                    onComplete = function () {
                        if (!(animationComplete && ajaxComplete)) {
                            return;
                        }

                        var container = this.options.toolContainer;
                        var entities = container.getElementsByClassName('entity');

                        if (!imgComplete) {
                            $(entities).ready(function () {
                                imgComplete = true;
                                onComplete.call(editor);
                            });
                            return;
                        }

                        $clone.removeClass('loading');

                        var $window = $(window);
                        var center = {
                            x: $window.width() / 2,
                            y: $window.height() / 2
                        };

                        var points = pizzaSlice(center, entities, 130);

                        points.forEach(function (point) {
                            var $point = $(point.el);
                            $point.css({
                                'position': 'fixed',
                                'display': 'inline-block'
                            });
                            $point.offset({
                                top: center.y - $point.height() / 2,
                                left: center.x - $point.width() / 2
                            }).animate({
                                top: point.y - $point.height() / 2,
                                left: point.x - $point.width() / 2,
                                opacity: 1
                            });
                        });
                    };

                });
            $('#center-stage-backdrop').click(function () {
                _p.hideCenterStage.call(editor);
            });
        },
        createModule: function (dbModule, originalOffset) {
            console.log('Create Module', arguments);
            var editor = this;
            var module = {
                id: ++autoIncrementModuleID,
                db: dbModule,
                x: 0,
                y: 0,
                dom: document.createElement('img'),
                loaded: false
            };

            var $clone = $(module.dom);

            module.dom.draggable = false;
            module.dom.classList.add('entity');
            $clone.attr('src', fitImageURL(dbModule.top_image, {width: editor.zoom(dbModule.width).toFixed()}));
            $clone.css('position', 'absolute');

            $clone.appendTo(editor.options.puzzle.options.domContainer);
            if (originalOffset) {
                $clone.offset(originalOffset);
                var position = $clone.position();
                module.x = editor.unzoom(position.left);
                module.y = editor.unzoom(position.top);
            }

            module.dom.addEventListener('load', function () {
                _p.hideCenterStage.call(editor);
                if (module.loaded) {
                    return;
                }

                module.loaded = true;

                _p.updateModule.call(editor, module);

            });
            module.dom.addEventListener('click', function (ev) {
                ev.stopPropagation();
            });
            editor.options.select.registerSelectable($clone.get(0));

            var userButtons = [];
            var mover = editor.options.select.createIconButton('move');
            userButtons.push(mover);

            mover.title = "Trage pentru a muta modulul";

            interact(mover).draggable({
                onstart: function () {
                    var offset = $(module.dom).offset();
                    // update the position attributes
                    module.dom.setAttribute('data-x', offset.left);
                    module.dom.setAttribute('data-y', offset.top);
                    $(userButtons).not(mover).fadeOut('slow');
                },
                onmove: function (event) {
                    // event.stopPropagation();

                    module.x += editor.unzoom(event.dx);
                    module.y += editor.unzoom(event.dy);

                    $clone.trigger('move-options.select.puzzle', [{
                        dx: (event.dx),
                        dy: (event.dy)
                    }]);

                    _p.updateModule.call(editor, module);
                },
                onend: function() {
                    $(userButtons).not(mover).fadeIn('slow');
                }
            });

            interact(mover).on('tap', function() {
                $(userButtons).fadeToggle('fast', function() {
                    $clone.trigger('hide-options.select.puzzle');
                });
            });

            $clone.on('click', function (ev) {
                ev.stopPropagation();
            });

            var deleter = editor.options.select.createIconButton('bin');
            userButtons.push(deleter);

            deleter.title = "Apasă pentru a șterge modulul";

            interact(deleter).on('tap', function () {
                delete (editor.modules[module.id]);
                $clone.remove();
                _p.displaySave.call(editor);

                $(editor.options.puzzle.options.domContainer).trigger('update.price', [editor]);

                $clone.trigger('hide-options.select.puzzle');

                userButtons.forEach(function(btn){
                    $(btn).remove();
                });
            });

            var rotator = editor.options.select.createIconButton('rotate');
            userButtons.push(rotator);
            rotator.title = "Trage de acest buton pentru a roti modulul";
            var rotatorStart = {
                x: 0,
                y: 0
            };
            var startButtonOffset = {};
            var startRotation = 0;
            var currentRotation = 0;

            interact(rotator).draggable({
                onstart: function(event) {
                    var offset = $clone.offset();
                    rotatorStart.x = event.clientX;
                    rotatorStart.y = event.clientY;
                    startButtonOffset = $(rotator).position();
                    $(userButtons).not(rotator).fadeOut('slow');
                },
                onmove: function(event) {
                    var rotatorCurrent = {
                        x: event.clientX,
                        y: event.clientY
                    };

                    $(rotator).offset({
                        top: event.clientY - $(rotator).outerHeight() /2,
                        left: event.clientX - $(rotator).outerWidth() /2
                    });

                    module.rotation = startRotation + Math.PI*2 + Math.PI/2 - Math.atan2(rotatorStart.x - rotatorCurrent.x, rotatorStart.y - rotatorCurrent.y);
                    module.rotation%=Math.PI*2;

                    _p.updateModule.call(editor, module);
                },
                onend: function(event) {
                    startRotation = module.rotation;
                    $(rotator).animate(startButtonOffset);
                    $(userButtons).not(rotator).fadeIn('slow');
                }
            });

            userButtons.forEach(function(btn){
                $(btn).on('click', function(ev) {
                    ev.stopPropagation();
                });
                $(btn).on('mousemove', function (ev) {
                    // ev.stopPropagation();
                });
            });

            $clone.on('get-options.select.puzzle', function(ev, pos) {
                _p.selectModule.call(editor, module.id);
                userButtons.forEach(function(btn){
                    $(btn).show();
                });
                $clone.trigger('response.get-options.select.puzzle', [userButtons]);
            }).on('hide-options.select.puzzle', function() {
                $(userButtons).hide();
                _p.deselectModule.call(editor);
            });


            $(this.options.puzzle).on('zoom.gardenpuzzle', function () {
                $clone.trigger('hide-options.select.puzzle');
            });

            this.modules[module.id] = module;

            $(editor.options.puzzle.options.domContainer).trigger('update.price', [editor]);
            return module;
        },
        deselectModule: function() {
            if (!this.selectedModule) {
                return;
            }
            this.selectedModule.dom.classList.remove('selected');
        },
        displayLoad: function (onDone) {

            var controller = this;
            var jsonModules = localStorage.garden_modules;

            if (!jsonModules) {
                onDone.call(controller);
                return;
            }

            var simpleModules = [];

            try {
                simpleModules = JSON.parse(jsonModules);
            } catch (ex) {
                onDone.call(controller);
                return;
            }

            var moduleIDs = [];

            simpleModules.forEach(function (simpleModule) {
                moduleIDs.push(simpleModule.m);
            });

            _p.loadEntities.call(this, {id: moduleIDs}, function() {
                simpleModules.forEach(function (simpleModule) {
                    var dbModule = this.modulesById[simpleModule.m];
                    var module = _p.createModule.call(this, dbModule);

                    module.x = simpleModule.p[0];
                    module.y = simpleModule.p[1];
                    module.rotation = simpleModule.r || 0;

                    _p.updateModule.call(this, module);
                }, this);
                onDone.call(controller);
            });

        },
        displaySave: function () {
            var simpleModules = this.serialize();

            localStorage.garden_modules = JSON.stringify(simpleModules);
        },
        expandRootCategory: function (domTarget) {
            var $target = $(domTarget);

            $target.siblings('.subcategories').slideToggle();
        },
        expandSubCategory: function (domTarget, onComplete) {
            var editor = this;
            var $target = $(domTarget);
            var $parent = $target.parent();

            if ($parent.hasClass('center-stage')) {
                $parent.remove();

                $target.removeClass('center-stage');
                $('#center-stage-backdrop').fadeOut();
            } else {
                var $clone = $parent.clone(true).insertBefore($parent);
                var $window = $(window);

                var offset = $clone.offset();

                $clone.css('position', 'fixed');
                $clone.offset(offset);
                $clone.addClass('loading');
                $clone.animate({
                    top: ($window.height() - $clone.height()) / 2,
                    left: ($window.width() - $clone.width()) / 2,
                }, 'fast', function () {
                    onComplete.call(editor, $clone);
                });
                $clone.addClass('center-stage');
                $('#center-stage-backdrop').fadeIn();
                $('#tool-container').show();
            }
        },
        hideCenterStage: function () {
            $('#center-stage-backdrop').hide();
            $('#module-categories .center-stage').remove();
            $('#tool-container').hide();
        },
        loadEntities: function (filter, onDone) {
            var module = this;

            var container = this.options.toolContainer;
            container.innerHTML = '';

            // TODO Load entities from Server
            jQuery.getJSON(PUZZLE_URL + '/modules', filter).success(function (modules) {

                module.modulesById = modules;

                var letter_distance = 10;

                for (var eid in modules) {
                    var entity = modules[eid];

                    var wrap = document.createElement('div');
                    wrap.classList.add("entity");
                    wrap.dataset.entity = JSON.stringify(entity);
                    var projPrice = document.createElement('div');
                    projPrice.classList.add("project-price");
                    var projPriceText = "Proiect " + entity.price + " lei";

                    for (var lettr_index = 0; lettr_index < projPriceText.length; lettr_index++) {
                        var domLetter = document.createElement('span');
                        domLetter.classList.add("letter");
                        domLetter.textContent = projPriceText[lettr_index];
                        projPrice.appendChild(domLetter);
                    }

                    wrap.appendChild(projPrice);

                    var currentLetterDeg = 1 - (projPriceText.length / 2) * letter_distance + letter_distance / 2;

                    $(projPrice).children().each(function (_, domLetter) {
                        domLetter.style.transform = "rotate(" + currentLetterDeg + "deg)";

                        currentLetterDeg += letter_distance;
                    });

                    var img = document.createElement('img');
                    img.src = fitImageURL(entity.top_image, {height: 50});
                    wrap.appendChild(img);

                    var detailsWrap = document.createElement('div');
                    detailsWrap.classList.add('details');
                    var categWrap = document.createElement('div');
                    categWrap.classList.add('categories');

                    for (var categ_id in entity.categories) {
                        var categSlug = entity.categories[categ_id];
                        var domCateg = document.createElement('i');
                        domCateg.classList.add('icon-category', 'icon-category-' + categSlug);

                        categWrap.appendChild(domCateg);
                    }

                    detailsWrap.appendChild(categWrap);

                    var front_img = document.createElement('img');
                    front_img.classList.add('side-front')
                    front_img.src = fitImageURL(entity.front_image, {height: 150});
                    detailsWrap.appendChild(front_img);
                    var mature_front_img = document.createElement('img');
                    mature_front_img.classList.add('side-mature')
                    mature_front_img.src = fitImageURL(entity.mature_front_image, {height: 150});
                    detailsWrap.appendChild(mature_front_img);

                    wrap.appendChild(detailsWrap);

                    container.appendChild(wrap);
                    wrap.style.display = 'none';
                    wrap.style.opacity = 0;

                }
            }).always(function () {
                onDone.call(module);
            });
        },
        selectModule: function(moduleId) {
            _p.deselectModule.call(this);
            var module = this.modules[moduleId];
            module.dom.classList.add('selected');
            this.selectedModule = module;
        },
        updateModule: function (module) {
            var $module = $(module.dom);
            module.dom.style.top = (this.offsetY(this.zoom(module.y)) - $module.height() / 2) + 'px';
            module.dom.style.left = (this.offsetX(this.zoom(module.x)) - $module.width() / 2) + 'px';
            module.dom.style.transform = 'rotate(' + (module.rotation) + 'rad)';
            _p.displaySave.call(this);
        },
        zoom: function(){
            var controller = this;
            for (var id in this.modules) {
                var module = this.modules[id];
                module.dom.width = this.zoom(module.db.width);
                module.dom.height = this.zoom(module.db.height);
                module.dom.src = fitImageURL(module.db.top_image, {width: this.zoom(module.db.width).toFixed()});
                _p.updateModule.call(controller, module);
                $(module.dom).trigger('hide-options.select.puzzle');
            }
        }
    };

    return ModulesEditor;
}());
