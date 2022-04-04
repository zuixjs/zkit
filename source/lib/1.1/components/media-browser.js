'use strict';

/**
 * MenuOverlay class.
 *
 * @author Gene
 * @version 1.1.1 (2022-03-30)
 *
 * @author Gene
 * @version 1.1.0 (2022-03-25)
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function MediaBrowser(cp) {
  // state vars
  let currentPage = 0;
  let inlineMode = false;
  let showingControls = false;
  let showingFullscreen = true;

  // view-pager views
  let fullView;
  let listView;

  // UI control buttons
  /** @type ZxQuery */
  let imageList;

  cp.create = function() {
    // export public component methods
    cp.expose({
      open: openBrowser,
      close: closeBrowser,
      current: setCurrent,
      showControls,
      hideControls,
      toggleControls,
      refresh: refreshViewPagers,
      fullScreen: function(fullScreen) {
        fullScreen ? enterFullscreen() : exitFullscreen();
      },
      next: function() {
        fullView.next();
      },
      prev: function() {
        fullView.prev();
      }
    });

    // UI state
    cp.expose('ui', {get: function() {
      return {
        currentPage,
        isFirstPage: function() {
          return currentPage === 0;
        },
        isLastPage: function() {
          return !imageList || currentPage === imageList.length() - 1;
        },
        inlineMode,
        showingFullscreen
      };
    }});

    // Carousel ViewPager component
    const carousel = cp.field('carousel');
    zuix.context(carousel, function() {
      listView = this;
      listView
          .on('page:change', pageChanged)
          .on('page:tap', function(e, page) {
            fullView.page(page);
          });
      // highlight initial page
      setTimeout(() => {
        const firstPage = listView.get(0);
        firstPage && firstPage.addClass('page-active');
      });
    });

    // Main ViewPager component
    const mediaList = cp.field('media');
    zuix.context(mediaList, function() {
      fullView = this;
      fullView.on({
        'page:tap': function() {
          toggleControls();
          cp.view().get().focus();
        },
        'page:change': function(e, page) {
          listView.page(page.in);
          cp.trigger('page:change', page);
        }
      });
      // sets list of media with thumbnails and full size items
      // with temporary preview background
      imageList = mediaList.children().each(function(i, el) {
        let preview = this.find('[z-field="preview"]');
        // TODO: the following 4 lines were added for backward compatibility with 1.0.0
        if (preview.get() && preview.get().tagName !== 'IMG') {
          preview.attr('z-field', null);
          preview = preview.find('IMG').attr('z-field', 'preview');
        }
        // refresh the viewpager when images are loaded
        preview.on('load error', function() {
          if (listView) listView.refresh();
        });
        if (preview.length() > 0) {
          this.css({
            background: 'url("'+preview.attr('src')+'") scroll no-repeat center/contain'
          });
          carousel.append(preview.detach().get());
        } else {
          // TODO: add a button or something if preview thumbnail not specified
          carousel.append(document.createElement('div'));
        }
      });
      // creates lazy loaded components to host full sized media
      mediaList.children().each(function(i, el) {
        let type = this.attr('data-type');
        if (type == null) type = 'image'; // default type
        this.attr('z-load', cp.context.componentId + '/' + type);
        this.attr('z-lazy', true);
        this.attr('data-index', i);
        zuix.context(el, function() {
          this.host(cp.view());
        });
      });
      // set auto-slide option
      const autoSlide = cp.view().attr('data-o-slide') || cp.options().slide;
      fullView.slide(autoSlide != null ? +autoSlide : false);
      // final initialization steps
      initializeAnimations();
      preventImageDrag();
      // setup complete, open media-browser
      showControls();
      if (inlineMode) {
        openBrowser();
      }
    });

    // Keyboard navigation handling
    cp.view().attr('tabindex', 0);
    document.body.addEventListener('keydown', function(e) {
      if (cp.view().get() !== document.activeElement) {
        return;
      }
      switch (e.code) {
        case 'Escape':
          closeBrowser();
          e.preventDefault();
          break;
        case 'Space':
          toggleControls();
          e.preventDefault();
          break;
        case 'ArrowLeft':
          fullView.prev();
          e.preventDefault();
          break;
        case 'ArrowUp':
          showControls();
          e.preventDefault();
          break;
        case 'ArrowRight':
          fullView.next();
          e.preventDefault();
          break;
        case 'ArrowDown':
          hideControls();
          e.preventDefault();
          break;
      }
    });

    // if not inlineMode mode === true, the media-browser will be hidden
    // and show only fullscreen after the `open()` method is called
    inlineMode = cp.view().attr('data-o-inline') === 'true' || cp.options().inline;
    if (!inlineMode) {
      cp.view().hide();
      showingFullscreen = false;
      const buttonName = cp.view().attr('data-o-button') || cp.options().button;
      const button = zuix.field(buttonName);
      button.on('click', openBrowser);
    } else {
      // without this timeout the component sometimes starts "hidden"
      setTimeout(exitFullscreen, 100);
    }
  };

  function pageChanged(e, page) {
    currentPage = +page.in;
    const pageIn = listView.get(currentPage);
    if (pageIn) {
      pageIn.addClass('page-active');
    }
    const pageOut = listView.get(+page.out);
    if (pageOut) {
      pageOut.removeClass('page-active');
    }
  }

  function setCurrent(current) {
    return fullView.page(current);
  }

  function openBrowser() {
    if (!inlineMode) {
      enterFullscreen();
    }
    cp.view().show();
    cp.trigger('open');
  }
  function closeBrowser() {
    exitFullscreen();
    if (!inlineMode) {
      cp.trigger('close');
    }
  }

  function enterFullscreen() {
    if (!showingFullscreen) {
      showingFullscreen = true;
      cp.view().addClass('fullscreen').css({
        height: null,
        maxHeight: null
      });
      refreshViewPagers();
      cp.trigger('fullscreen:open');
    }
  }
  function exitFullscreen() {
    if (showingFullscreen) {
      showingFullscreen = false;
      if (inlineMode) {
        cp.view().removeClass('fullscreen');
        const style = getComputedStyle(cp.view().get());
        const actualWidth = parseInt(style.width);
        const actualHeight = parseInt(style.height);
        if (actualHeight === 0) {
          const computedHeight = (actualWidth / 16 * 9 );
          cp.view().css({
            height: computedHeight + 'px',
            maxHeight: computedHeight + 'px'
          });
        }
        refreshViewPagers();
      }
      cp.trigger('fullscreen:close');
    }
  }

  function toggleControls() {
    if (showingControls) {
      hideControls();
    } else {
      showControls();
    }
  }
  function hideControls() {
    showingControls = false;
    cp.trigger('controls:hide');
  }
  function showControls() {
    showingControls = true;
    if (listView != null && fullView != null) {
      listView.page(fullView.page());
    }
    cp.trigger('controls:show');
  }

  function refreshViewPagers() {
    setTimeout(function() {
      if (listView) listView.refresh();
      if (fullView) fullView.refresh();
    }, 10);
  }

  function preventImageDrag() {
    // prevent default dragging on image elements
    cp.view().on('dragstart', {
      handler: function(e) {
        if (e.target.nodeName.toUpperCase() === 'IMG') {
          e.preventDefault();
        }
      },
      passive: false
    });
  }

  function initializeAnimations() {
    const commonOptions = {
      duration: '0.5s',
      timingFunction: 'ease-in-out'
    };
    cp.addTransition( 'fadeIn', {
      transform: 'translateXY(0,0)',
      opacity: '1'
    }, commonOptions);
    cp.addTransition( 'fadeOutUp', {
      transform: 'translateY(-200px)',
      opacity: '0'
    }, commonOptions);
    cp.addTransition( 'fadeOutDown', {
      transform: 'translateY(200px)',
      opacity: '0'
    }, commonOptions);
    cp.addTransition('fadeOutLeft', {
      transform: 'translateX(-100px)',
      opacity: 0
    }, commonOptions);
    cp.addTransition('fadeOutRight', {
      transform: 'translateX(100px)',
      opacity: 0
    }, commonOptions);
    cp.addTransition('zoomIn', {
      transform: 'scale(1)'
    }, {
      duration: '250ms',
      timingFunction: 'ease-in-out'
    });
    cp.addTransition('zoomOut', {
      transform: 'scale(0)'
    }, {
      duration: '250ms',
      timingFunction: 'ease-in-out'
    });
  }
}

module.exports = MediaBrowser;
