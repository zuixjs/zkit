'use strict';

/**
 * MenuOverlay class.
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function MediaBrowser() {
  let currentPage = 0;
  let itemsListVisible = false;
  // view-pager views
  let fullView;
  let listView;
  /** @typedef {ZxQuery} */
  let imageList;
  /** @typedef {ZxQuery} */
  let buttonNext;
  /** @typedef {ZxQuery} */
  let buttonPrev;
  /** @typedef {ZxQuery} */
  let buttonClose;

  let youtubeApiCallbacks = [];
  let youtubeApiReady = false;

  if (zuix.ZxQuery.prototype.animateCss == null) {
    zuix.ZxQuery.prototype.animateCss = function() {
      return this;
    };
  }

  const cp = this;

  cp.create = function() {
    // export public component methods
    cp.expose('open', openBrowser)
        .expose('close', closeBrowser)
    // .expose('items', setItems)
        .expose('youtubeApi', function(callback) {
          if (youtubeApiReady) callback();
          else youtubeApiCallbacks.push(callback);
        }).expose('current', setCurrent)
        .expose('showControls', showControls)
        .expose('hideControls', hideControls)
        .expose('toggleControls', toggleControls)
        .expose('showList', showList)
        .expose('hideList', hideList);

    cp.view().css({
      'position': 'fixed',
      'left': 0,
      'right': 0,
      'top': 0,
      'bottom': 0
    }).hide();

    // load Animate CSS extension
    zuix.using('component', '@lib/extensions/animate-css', function() {
      showControls();
    });

    // add youtube API
    // This code loads the IFrame Player API code asynchronously.
    window.onYouTubeIframeAPIReady = function() {
      zuix.$.each(youtubeApiCallbacks, function() {
        this();
      });
      youtubeApiCallbacks = [];
      youtubeApiReady = true;
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = cp.view().find('script').get();
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Main ViewPager
    zuix.context(cp.field('media'), function() {
      fullView = this
          .on('gesture:tap', toggleControls)
          .on('page:change', function(e, page) {
            listView.page(page.in);
            cp.trigger('page:change', page);
          });
      buttonPrev = cp.field('nav-prev').on('click', function() {
        fullView.prev();
      });
      buttonNext = cp.field('nav-next').on('click', function() {
        fullView.next();
      });
      buttonClose = cp.field('nav-close').on('click', closeBrowser);
      // setup media list with thumbnails and full screen items with temporary background preview
      imageList = cp.field('media')
          .children().each(function(i, el) {
            const preview = this.find('[z-field="preview"]');
            if (preview.length() > 0) {
              this.css({
                background: 'url("'+preview.find('img').attr('src')+'") scroll no-repeat center/contain'
              });
              cp.field('carousel')
                  .append(preview.detach().get());
            } else {
              // TODO: add a button or something if preview thumbnail not specified
              cp.field('carousel')
                  .append(document.createElement('div'));
            }
          });
      cp.field('media').children().each(function(i, el) {
        let type = this.attr('data-type');
        if (type == null) type = 'image'; // default type
        this.attr('z-load', cp.context.componentId+'/'+type);
        if (type !== 'video') {
          this.attr('z-lazy', true);
        }
        this.attr('data-index', i);
        zuix.context(el, function() {
          this.host(cp.view());
        });
      });
    });
    // Carousel ViewPager
    zuix.context(cp.field('carousel'), function() {
      listView = this;
      listView
          .on('page:change', pageChanged)
          .on('page:tap', function(e, page) {
            fullView.page(page);
          });
    });
    // Keyboard navigation handling
    cp.view().attr('tabindex', 0)
        .on('blur', function() {
          this.get().focus();
        }).get().focus();
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 27: // esc
          closeBrowser();
          break;
        case 32: // space
          toggleControls();
          break;
        case 37: // left
          fullView.prev();
          break;
        case 38: // up
          showControls();
          break;
        case 39: // right
          fullView.next();
          break;
        case 40: // down
          hideControls();
          break;
      }
    };
  };

  function pageChanged(e, page) {
    currentPage = page.in;
    listView.get(currentPage)
        .attr('z-lazy', false)
        .children().eq(0).addClass('page-active');
    if (page.out !== -1) {
      listView.get(page.out).children().eq(0).removeClass('page-active');
    }
    updateButtons();
    // TODO: not yet sure why is this timeout required to make it work
    setTimeout(function() {
      zuix.componentize(cp.field('media'), listView.get(currentPage));
    }, 200);
  }

  function setCurrent(current) {
    return fullView.page(current);
  }

  function openBrowser() {
    // hide navigation buttons
    buttonClose.animateCss('rotateIn', {duration: '0.75s'});
    buttonNext.hide();
    buttonPrev.hide();
    // show the media browser and update buttons
    cp.field('media').removeClass('hidden');
    cp.view().animateCss('zoomIn', {duration: '0.5s'}, function() {
      // refresh ViewPager
      fullView.refresh();
      listView.refresh();
      updateButtons();
      // TODO: not yet sure why is this timeout required to make it work
      // force load of current item
      setTimeout(function() {
        // make pages visible (this should run once though)
        cp.field('media').children().each(function() {
          this.css('visibility', 'visible');
        });
        zuix.componentize(cp.field('media'), listView.get(currentPage));
      }, 200);
      this.trigger('open');
    }).show();
    return cp.context;
  }

  function closeBrowser() {
    buttonClose.animateCss('rotateOut', {duration: '0.5s'});
    cp.view().animateCss('zoomOut', {duration: '0.5s', delay: '0.15s'}, function() {
      this.hide();
    }).trigger('close');
    return cp.context;
  }

  function updateButtons() {
    if (imageList == null) return;
    // show navigation buttons as needed
    if (currentPage < imageList.length() - 1) {
      if (buttonNext.display() === 'none') {
        buttonNext.animateCss('fadeInRight').show();
      }
    } else {
      if (buttonNext.display() !== 'none') {
        buttonNext.animateCss('fadeOutRight', function() {
          this.hide();
        });
      }
    }
    if (currentPage > 0 && imageList.length() > 1) {
      if (buttonPrev.display() === 'none') {
        buttonPrev.animateCss('fadeInLeft').show();
      }
    } else {
      if (buttonPrev.display() !== 'none') {
        buttonPrev.animateCss('fadeOutLeft', function() {
          this.hide();
        });
      }
    }
    if (buttonClose.display() === 'none') {
      buttonClose.animateCss('fadeInDown', {duration: '0.35s', delay: '0.5s'}).show();
    }
  }

  function toggleControls(e, tp) {
    if (tp == null || !zuix.$(tp.event.target).hasClass('capture-touch')) {
      if (cp.field('controls').display() !== 'none') {
        hideControls();
      } else {
        showControls();
      }
      if (tp != null) tp.cancel();
    }
  }

  function showList() {
    if (!itemsListVisible) {
      itemsListVisible = true;
      cp.field('controls').animateCss('fadeInUp').show();
      if (listView != null && fullView != null) {
        listView.page(fullView.page());
      }
      cp.trigger('controls:show');
    }
  }
  function hideList() {
    if (itemsListVisible) {
      itemsListVisible = false;
      cp.field('controls').animateCss('fadeOutDown', function() {
        this.hide();
      });
    }
  }

  function hideControls() {
    hideList();
    if (buttonPrev.display() !== 'none') {
      buttonPrev.animateCss('fadeOutLeft', function() {
        this.hide();
      });
    }
    if (buttonNext.display() !== 'none') {
      buttonNext.animateCss('fadeOutRight', function() {
        this.hide();
      });
    }
    if (buttonClose.display() !== 'none') {
      buttonClose.animateCss('fadeOutUp', {duration: '0.35s'}, function() {
        this.hide();
      });
    }
    cp.trigger('controls:hide');
  }
  function showControls() {
    showList();
    updateButtons();
  }
}

module.exports = MediaBrowser;
