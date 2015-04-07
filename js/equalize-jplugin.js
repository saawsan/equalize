/*jshint browser:true, curly:true, eqeqeq:false, forin:true, strict:false, undef:true*/ 
/*global jQuery:false, $:false*/
;(function($,sr){
    // http://jsfiddle.net/w3LXP/2/
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap) { func.apply(obj, args); }
                timeout = null;
            }

            if (timeout) { 
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    };
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

;(function ($) {

})( jQuery );

;(function ($) {
    var pluginName = 'equalize';
    var defaults =  {};

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.$elt = $(element);
        this.$items = this.$elt.find('[data-equalize-item]');
        this.tType = [];
        if(this.$elt.data('equalize').length){
            this.tType = this.$elt.data('equalize').split(';');
        }
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var oCfg = this;
            oCfg.initAllHeights();

            $(window).smartresize(function(){
                oCfg.initAllHeights();
            });
        },
        initAllHeights: function () {
            // var tType = [];
            var nMaxHeight;
            if(this.tType.length){
                // this.tType = this.$elt.data('equalize').split(';');
                for(var i=0; i<this.tType.length; i++){
                    this.initAllHeightsByType(this.tType[i]);
                }
            } else {
                this.$items.css('height','auto');
                nMaxHeight = this.getMaxHeight(this.getItemsHeight());
                this.setItemsHeight(nMaxHeight);
            }
        },
        initAllHeightsByType: function (sType) {
            var $items = this.$items.filter('[data-equalize-item='+sType+']');
            $items.css('height','auto');
            var nMaxHeight = this.getMaxHeight(this.getItemsHeight($items));
            this.setItemsHeight(nMaxHeight, $items);
        },
        getItemsHeight: function ($items) {
            var oCfg = this;
            var tHeight = [];
            var $currentItems = $items || oCfg.$items;
            $currentItems.each(function(){
                tHeight.push($(this).height());
            });
            return tHeight;
        },
        getMaxHeight: function (tHeight) {
            return Math.max.apply(null, tHeight);
        },
        setItemsHeight: function (nMaxHeight, $items) {
            var oCfg = this;
            var $currentItems = $items || oCfg.$items;
            $currentItems.each(function(){
                $(this).css('height', nMaxHeight+'px');
            });
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });

        return this;
    };

    //Use 'onload' to insure all images are fully loaded before equalize height. It may not work properly on all browsers.
    $(window).bind('load', function() {
        $('[data-equalize]')[pluginName]();
    });

})( jQuery );