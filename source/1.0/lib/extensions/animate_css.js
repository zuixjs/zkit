/**
 * ZUIX - AnimateCSS extension for {ZxQuery} objects
 *
 * @version 1.0.2 (2018-02-10)
 * @author Gene
 *
 */

zuix.controller(function(cp) {
    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
        // Load library from CDN if not already included in the document
        if (!zuix.$.classExists('.animated .bounce')) {
            zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');
        }
    };
    /**
     * Extension function ZUIX+AnimateCSS
     *
     * @param {string} animationName
     * @param {object} [param1] optional animation options or animation-end callback
     * @param {function} [param2] optional animation-end callback when param1 is the animation options object
     * @return {zuix.$.ZxQuery}
     */
    zuix.$.ZxQuery.prototype.animateCss = function(animationName, param1, param2) {
        const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        const _t = this;
        let callback;
        let options;
        if (typeof param2 === 'function') {
            options = param1;
            callback = param2;
        } else if (typeof param1 === 'function') {
            callback = param1;
        }
        if (typeof animationName !== 'string') {
            if (typeof animationName === 'function') {
                callback = animationName;
            } else {
                options = animationName;
            }
            animationName = '';
        } else options = param1;
        // TODO: should run all the following code for each element in the ZxQuery selection
        const prefixes = ['-webkit', '-moz', '-o', '-ms'];
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                for (let p = 0; p < prefixes.length; p++) {
                    this.css(prefixes[p] + '-animation-' + key, options[key]);
                }
            }
        }
        // stops any previously running animation
        if (this.hasClass('animated')) {
            this.css('transition', 'initial'); // TODO: <-- is this really needed?
            this.trigger('animationend');
        }
        this.addClass('animated ' + animationName);
        // add event listener for animation end
        this.one(animationEnd, function() {
            if (animationName !== '') {
                this.removeClass('animated ' + animationName);
            }
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    for (let p = 0; p < prefixes.length; p++) {
                        _t.css(prefixes[p] + '-animation-' + key, '');
                    }
                }
            }
            if (typeof callback === 'function') {
                callback.call(_t, animationName);
            }
        });
        return this;
    };
});
