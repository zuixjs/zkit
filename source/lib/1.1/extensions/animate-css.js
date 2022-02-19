/**
 * zuix.js - `animateCss` extension method for {ZxQuery} objects
 *
 * @version 1.1.0 (2021-12-21)
 * @author Gene
 *
 */

/**
 * ZuixAnimateCss class.
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function ZuixAnimateCss() {
  // Load library from CDN if not already included in the document
  if (!zuix.$.classExists('.animate__animated .animate__bounce')) {
    zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
  }
  if (zuix.$.ZxQuery.prototype.animateCss) {
    return;
  }
  /**
   * Animate.css extension method for `zuix.js`
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
    } else {
      options = param1;
    }
    // TODO: should run all the following code for each element in the ZxQuery selection
    const prefixes = ['-webkit', '-moz', '-o', '-ms'];
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        for (let p = 0; p < prefixes.length; p++) {
          this.css(prefixes[p] + '-animation-' + key, options[key]);
        }
      }
    }
    // stops any previously running animation
    if (this.hasClass('animate__animated')) {
      this.css('transition', 'initial'); // TODO: <-- is this really needed?
      if (this.attr('class')) {
        const classes = this.attr('class').split(' ').filter(function(c) {
          return c.startsWith('animate__');
        }).join(' ');
        this.removeClass(classes);
      }
      this.trigger('animationend');
    }
    this.addClass('animate__animated animate__' + animationName);
    // add event listener for animation end
    this.one(animationEnd, function() {
      const classes = this.attr('class').split(' ').filter(function(c) {
        return c.startsWith('animate__');
      }).join(' ');
      this.removeClass(classes);
      for (const key in options) {
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
}

module.exports = ZuixAnimateCss;
