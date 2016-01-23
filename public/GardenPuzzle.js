var GardenPuzzle = (function(){
    /**
     * Default options
     * @type Object
     */
    var defaultOptions = {
        domContainer: document.getElementById('garden-container')
    };

    /**
     * Class GardenPuzzle
     * @param {Object} options
     * @returns {new GardenPuzzle}
     */
    function GardenPuzzle(options) {

        /**
         * Puzzle options
         */
        this.options = populateDefaults(options || {}, defaultOptions);

        /**
         * Current working module
         */
        this.currentModule = {};

        /**
         * All modules
         */
        this.modules = {};

        _p.init.call(this);
    }

    /**
     * Private methods
     * @type Object
     */
    var _p = {
        init: function() {
            var puzzle = this;

            this.modules.price = new PriceController({
                puzzle: this,
                domContainer: document.getElementById('garden-price')
            });

            this.modules.zoom = new ZoomController({
                puzzle: this,
                domContainer: document.getElementById('garden-zoom')
            });

            this.modules.select = new SelectController({
                puzzle: this
            });

            this.modules.perimeter = new PerimeterController({
                puzzle: this,
                zoom: this.modules.zoom,
                select: this.modules.select
            });

            this.modules.toolbox = new ToolboxModule({
                puzzle: this,
                zoom: this.modules.zoom,
                select: this.modules.select,
                domContainer: document.getElementById('garden-toolbox')
            });

            this.currentModule = this.modules.perimeter;

            var supportedEvents = ['click'];

            supportedEvents.forEach(function(evName) {
                puzzle.options.domContainer.addEventListener(evName, function() {
                    return _p.dispatchEvent.call(puzzle, evName, arguments);
                });
            });
        },

        dispatchEvent: function(eventName, args) {
            if (! this.currentModule.events ) {
                return;
            }

            if ('function' === typeof(this.currentModule.events[eventName])) {
                this.currentModule.events[eventName].apply(this.currentModule, args);
            }else if ('string' === typeof(this.currentModule.events[eventName])) {
                this.currentModule[this.currentModule.events[eventName]].apply(this.currentModule, args);
            }
        }
    };

    return GardenPuzzle;
}());