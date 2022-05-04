/** type {ComponentContext} */
let menuDrawer;
window.drawer_opts = {
  autoHideWidth: 1280,
  on: {
    'drawer:open': function() {
      /* ... */
    },
    'drawer:close': function() {
      /* ... */
    }
  },
  ready: function() {
    menuDrawer = this;
    menuDrawer.$.playAnimation(['animate__fadeIn', enterAnimation]);
  }
};

function scrollbarVisible(element) {
  const r = element.getBoundingClientRect();
  return r.bottom !== r.height;
}

const header = zuix.field('header');
let headerVisible = true;
function showHeader() {
  if (!headerVisible) {
    headerVisible = true;
    header
        .playAnimation(['animate__fadeOutUp', 'animate__fadeInDown'])
        .show();
  }
}
function hideHeader() {
  if (headerVisible && !header.isPlaying()) {
    headerVisible = false;
    header
        .playAnimation({
          classes: ['animate__fadeInDown', 'animate__fadeOutUp'],
          onEnd: function() {
            this.hide();
          }
        });
  }
}

function processExternalLinks(view) {
  // Force opening of all non-local links in a new window
  view.find('a[href*="://"]')
      .attr('target', '_blank')
      .attr('rel', 'noreferrer');
}

zuix.hook('view:process', function(view) {
  processExternalLinks(view);
});
processExternalLinks(zuix.$(document));

// add presentation anim to the drawer
const referrerLink = document.createElement('a');
referrerLink.href = document.referrer;
const enterAnimation =
  (referrerLink.pathname === '{{ app.baseUrl }}') ?
    'animate__fadeInLeft' : 'animate__fadeIn';
