'use strict';

/**
 * VideoItem class.
 *
 * @author Gene
 * @version 1.0.0 (2022-03-30)
 *
 * @constructor
 * @this {ContextController}
 */
function VideoItem(cp) {
  let mediaBrowser;
  let player;
  let controlsHideTimeout;
  let pageIndex = -1;

  cp.create = function() {
    pageIndex = +cp.view().attr('data-index');
    // expose public methods
    cp.expose('host', setHost);
    cp.expose('play', play);
    cp.expose('pause', pause);
    // set initial controls state
    cp.field('nav-pause').hide();
    // get reference to the video player instance
    player = cp.view('video').get();
    player.src = cp.field('url').attr('href') || cp.field('url').html();
    player.poster = cp.field('preview').html();
    zuix.$(player).on('pause playing', playerStateChanged);
  };

  function setHost(view) {
    const controls = cp.field('player-controls');
    mediaBrowser = zuix.context(view);
    mediaBrowser.on({
      'open': function() {
        if (isActive()) {
          play();
        }
      },
      'close': pause,
      'controls:show': function() {
        controls.playTransition({classes: 'fadeOutUp fadeIn', holdState: true});
      },
      'controls:hide': function() {
        controls.playTransition({classes: 'fadeIn fadeOutUp', holdState: true});
      },
      'page:change': pageChanged,
      'refresh:inactive': function() {
        if (mediaBrowser.ui.inlineMode && isActive() && !player.paused) {
          pause();
        }
      },
      'refresh:active': function() {
        if (mediaBrowser.ui.inlineMode && isActive() && player.paused) {
          play();
        }
      }
    });
    player.onplaying = playerStateChanged;
    if (mediaBrowser.current() === pageIndex) {
      play();
    }
  }

  function isActive() {
    return mediaBrowser && mediaBrowser.current() === pageIndex;
  }

  function pageChanged(e) {
    const page = e.detail;
    if (+page.out === pageIndex) {
      pause();
    } else if (+page.in === pageIndex) {
      play();
    }
  }

  function playerStateChanged(e) {
    if (controlsHideTimeout !== null) {
      clearTimeout(controlsHideTimeout);
    }
    if (e.type === 'playing') {
      cp.field('nav-play').hide();
      cp.field('nav-pause').show();
      controlsHideTimeout = setTimeout(function() {
        mediaBrowser.hideControls();
      }, 2500);
    } else if (e.type === 'pause') {
      cp.field('nav-play').show();
      cp.field('nav-pause').hide();
    }
  }

  function play() {
    try {
      player.play();
    } catch (e) {
      console.log(e);
    }
  }
  function pause() {
    player.pause();
  }
  function stop() {
    player.stop();
  }
}

module.exports = VideoItem;
