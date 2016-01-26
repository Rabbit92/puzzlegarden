/* 
 *  Unless otherwise specified, this is closed-source. Copying without permission is prohibited and may result in legal action with or without this license header
 */

var PriceController = (function () {
    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-price')
    };

    /**
     * Class PriceController
     * @param {Object} options
     * @returns {new PriceController}
     */
    function PriceController(options) {
        this.options = populateDefaults(options || {}, defaultOptions);

        _p.init.call(this);
    }

    /**
     * Private methods
     * @type Object
     */
    var _p = {
        init: function () {
            var controller = this;
            this.modules = [];
            this.prices = [];
            this.domTotal = this.options.domContainer.querySelectorAll('.total-number');
            this.domDetailsBtn = this.options.domContainer.querySelector('.details-btn');
            this.domDetailsContainer = this.options.domContainer.querySelector('.details-container');
            this.domCloseDetails = this.domDetailsContainer.querySelector('.details-content > .close');
            this.domDetailsGrid = this.domDetailsContainer.querySelector('.details-grid');
            this.domTemplateRow = this.domDetailsGrid.querySelector('[data-template]');
            this.orderForm = this.domDetailsContainer.querySelector('.order-form');

            _p.renderTotal.call(controller);
            (function ($) {
                $(this.options.puzzle.options.domContainer).on('update.price', function (ev, module) {
                    var index = controller.modules.indexOf(module);
                    if (index < 0) {
                        index = controller.modules.length;
                        controller.modules.push(module);
                        controller.prices.push(0);
                    }

                    controller.prices[index] = module.getPrice();

                    _p.renderTotal.call(controller);
                });
            })(jQuery);



            this.domCloseDetails.addEventListener('click', function () {
                _p.closeDetails.call(controller);
            });

            this.domDetailsBtn.addEventListener('click', function () {
                _p.openDetails.call(controller);
            });

            this.domDetailsContainer.addEventListener('click', function (ev) {
                if (ev.target === controller.domDetailsContainer) {
                    _p.closeDetails.call(controller);
                }
            });

        },
        /**
         * 
         * @returns {Number}
         */
        getTotal: function () {
            var total = 0;
            this.prices.forEach(function (val) {
                total += val;
            });

            return total;
        },
        cleanDetailsGrid: function () {
            var rows = this.domDetailsGrid.querySelectorAll('tbody tr[data-object]');

            for (var i = rows.length - 1; i >= 0; i--) {
                rows[i].parentElement.removeChild(rows[i]);
            }

            var serializedModules = this.orderForm.querySelectorAll('input.serialized');

            for (var i = serializedModules.length - 1; i >= 0; i--) {
                serializedModules[i].parentElement.removeChild(serializedModules[i]);
            }
        },
        closeDetails: function () {
            this.domDetailsContainer.classList.add('hidden');
            _p.cleanDetailsGrid.call(this);
        },
        openDetails: function () {
            _p.cleanDetailsGrid.call(this);

            this.modules.forEach(function (module) {
                var objects = module.getPricedObjects();
                for (var id in objects) {
                    var obj = objects[id];

                    var domClone = this.domTemplateRow.cloneNode(true);
                    this.domTemplateRow.parentNode.appendChild(domClone);
                    domClone.removeAttribute('data-template');
                    domClone.setAttribute('data-object', JSON.stringify(obj));
                    domClone.classList.remove('template');

                    var domFields = domClone.querySelectorAll('[data-field]');

                    for (var i = 0; i < domFields.length; i++) {
                        var domField = domFields[i];
                        var fieldName = domField.dataset.field;
                        switch (fieldName) {
                            case 'image':
                            case 'name':
                            case 'quantity':
                            case 'unit':
                                domField.innerHTML = obj[fieldName];
                                break;
                            case 'price':
                                domField.innerHTML = obj[fieldName].toFixed(2);
                                break;
                        }
                    }
                }

                // Add serialized hidden field 
                var elem = document.createElement('input');
                this.orderForm.appendChild(elem);
                elem.type = 'hidden';
                elem.classList.add('serialized');
                elem.name = module.getName();
                elem.value = JSON.stringify(module.serialize());
            }, this);
            this.domDetailsContainer.classList.remove('hidden');
        },
        renderTotal: function () {
            var total = _p.getTotal.call(this);

            (function ($) {
                $(this.domTotal).text(total.toFixed(2));
            })(jQuery);

        }

    };

    return PriceController;
}());