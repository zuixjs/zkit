/** type {ComponentContext} */
let menuDrawer;
/** type {ComponentContext} */
let menuButton;
window.drawer_opts = {
  autoHideWidth: 1280,
  on: {
    'drawer:open': function() {
      //zuix.context('menu_hamburger', function() {
      //  this.open();
      //});
    },
    'drawer:close': function() {
      //zuix.context('menu_hamburger', function() {
      //  this.close();
      //});
    }
  },
  ready: function() {
    menuDrawer = this;
    menuDrawer.$.animateCss(enterAnimation, {
      duration: '0.2s'
    });
  }
};
window.menuButtonOptions = {
  on: {
    'menu:open': function() {
      //headerMenu.open();
    },
    'menu:close': function() {
      //headerMenu.close();
    }
  },
  ready: function() {
    menuButton = this;
  }
};

let scrollHelper;
window.scroll_opts = {
  ready: (ctx) => {
    scrollHelper = ctx;
    setTimeout(enableScrollHelper, 500);
  }
};
function enableScrollHelper() {
  scrollHelper.on('scroll:change', function(e, data) {
    switch (data.event) {
      case 'hit-top':
        // reached top of the page
        showHeader();
        break;
      case 'scroll':
        // show/hide header when scrolling up/down
        if (data.info.shift.y > 0) {
          showHeader();
        } else {
          hideHeader();
        }
        break;
      case 'hit-bottom':
        // reached end of the page
        showHeader();
        break;
    }
  });
  setTimeout(function() {
    if (location.hash && scrollbarVisible(document.body)) {
      hideHeader();
    }
  }, 500);
}
function scrollbarVisible(element) {
  const r = element.getBoundingClientRect();
  return r.bottom !== r.height;
}

let headerVisible = true;
function showHeader() {
  if (!headerVisible) {
    headerVisible = true;
    zuix.field('header').animateCss('fadeInDown').show();
  }
  ////if (!menuButton.$.hasClass('animate__animated')) {
  //  menuButton.$.animateCss('fadeInDown').show();
  ////}
}
function hideHeader() {
  if (headerVisible && !zuix.field('header').hasClass('animate__animated')) {
    headerVisible = false;
    zuix.field('header').animateCss('fadeOutUp', function() {
      this.hide();
    });
  }
  ////if (!menuButton.$.hasClass('animate__animated')) {
  //  menuButton.$.animateCss('fadeOutUp', function() {
  //    this.hide();
  //  });
  ////}
}

function processExternalLinks(view) {
  // Force opening of all non-local links in a new window
  zuix.$(view).find('a[href*="://"]')
      .attr('target', '_blank')
      .attr('rel', 'noreferrer');
}

zuix.hook('view:process', function(view) {
  processExternalLinks(view);
});
processExternalLinks(document);

// add presentation anim to the drawer
const referrerLink = document.createElement('a');
referrerLink.href = document.referrer;
const enterAnimation =
  (referrerLink.pathname === '{{ app.baseUrl }}') ?
    'fadeInLeft' : 'fadeIn';
