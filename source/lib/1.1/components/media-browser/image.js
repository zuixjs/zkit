'use strict';

/**
 * ImageItem class.
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function ImageItem() {
  let mediaBrowser;
  let infoBox;

  const cp = this;

  cp.create = function() {
    cp.expose('host', setHost);
    cp.field('full-image').on('load', function() {
      cp.view().css({background: null});
      cp.view('.loader').hide();
    }).attr('src', cp.field('full').attr('href'));
    infoBox = cp.view('.info-container')
        .addClass('fadeIn');
  };

  function setHost(h) {
    mediaBrowser = zuix.context(h);
    const showTitleBox = cp.field('title').html().length > 0;
    if (showTitleBox) {
      h.on('controls:hide', function() {
        infoBox.addClass('fadeOutUp').removeClass('fadeIn');
      }).on('controls:show', function() {
        infoBox.removeClass('fadeOutUp').addClass('fadeIn');
      }).on('page:change', function(e, page) {
        if (mediaBrowser.current() === +cp.view().attr('data-index')) {
          infoBox.removeClass('fadeOutUp').addClass('fadeIn');
//          mediaBrowser.showControls();
        } else if (infoBox.position().visible) {
          infoBox.addClass('fadeOutUp').removeClass('fadeIn');
        }
      });
    } else {
      infoBox.hide();
    }
  }
}

module.exports = ImageItem;
