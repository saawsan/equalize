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
            };

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


/* TODO 
 * - Wait load images
 * - Nested data-equalize
 */
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
            this.$items.css('height','auto');
            this.nMaxHeight = this.getMaxHeight(this.getItemsHeight());
            this.setItemsHeight();
        },
        getItemsHeight: function () {
            var oCfg = this;
            var tHeight = [];
            oCfg.$items.each(function(){
                tHeight.push($(this).height());
            });
            return tHeight;
        },
        getMaxHeight: function (tHeight) {
            return Math.max.apply(null, tHeight);
        },
        setItemsHeight: function () {
            var oCfg = this;
            oCfg.$items.each(function(){
                $(this).css('height', oCfg.nMaxHeight+'px');
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

    $(window).on('load', function() {
        $('[data-equalize]')[pluginName]();
    });

})( jQuery );