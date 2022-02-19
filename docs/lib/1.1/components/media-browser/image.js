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
  const animOptions = {delay: '200ms', duration: '2s'};
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
        .animateCss('fadeIn', animOptions).show();
  };

  function setHost(h) {
    mediaBrowser = zuix.context(h);
    const showTitleBox = cp.field('title').html().length > 0;
    if (showTitleBox) {
      h.on('controls:hide', function() {
        infoBox.animateCss('fadeOutUp', function() {
          this.hide();
        });
      }).on('controls:show', function() {
        infoBox.animateCss('fadeIn', animOptions).show();
      }).on('page:change', function(e, page) {
        if (mediaBrowser.current() == cp.view().attr('data-index')) {
          infoBox.animateCss('fadeIn', animOptions).show();
          mediaBrowser.showControls();
        } else if (infoBox.position().visible) {
          infoBox.animateCss('fadeOut', () => infoBox.hide());
        }
      });
    } else {
      infoBox.hide();
    }
  }
}

module.exports = ImageItem;
