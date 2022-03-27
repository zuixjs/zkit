'use strict';

/**
 * VideoItem class.
 *
 * @author Gene
 * @version 1.1.0 (2022-03-27)
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function VideoItem(cp) {
  let mediaBrowser;
  let player;
  let isPlaying = false;
  let controlToggleTimeout;
  let pageIndex = -1;

  cp.create = function() {
    pageIndex = +cp.view().attr('data-index');
    // expose public methods
    cp.expose('host', setHost);
    cp.expose('setup', setPlayer);
    cp.expose('pause', pauseVideo);
    cp.expose('play', playVideo);
    cp.expose('active', isActive);
    // set initial controls state
    cp.field('nav-pause').hide();
    // load YouTube API if not already loaded
    const ytApiSrc = 'https://www.youtube.com/iframe_api';
    if (zuix.$.find('script[src="' + ytApiSrc + '"]').length() === 0) {
      const tag = document.createElement('script');
      tag.src = ytApiSrc;
      const firstScriptTag = zuix.$.find('script').get();
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  };

  function setHost(view) {
    mediaBrowser = zuix.context(view);
    const controls = cp.field('player-controls');
    view.on({
      'page:change': pageChanged,
      'open': function() {
        if (isActive()) {
          playVideo();
        }
      },
      'close': pauseVideo,
      'controls:show': function() {
        zuix.$.playTransition(controls, 'fadeOutUp fadeIn');
      },
      'controls:hide': function() {
        zuix.$.playTransition(controls, 'fadeIn fadeOutUp');
      }
    });
  }

  function isActive() {
    return mediaBrowser && mediaBrowser.current() === pageIndex;
  }

  function pageChanged(e) {
    if (!player && !player.playVideo) return;
    const page = e.detail;
    if (+page.out === pageIndex) {
      pauseVideo();
    } else if (+page.in === pageIndex) {
      playVideo();
    }
  }

  // YouTube Player API

  function setPlayer() {
    player = new YT.Player(cp.field('player').get(), {
      height: '100%',
      width: '100%',
      playerVars: {controls: 1, disablekb: 1, fs: 0, modestbranding: 0, rel: 0, showinfo: 0, ecver: 2},
      videoId: cp.field('video').html(),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    return player;
  }

  function onPlayerReady(event) {
    if (mediaBrowser.current() === pageIndex) {
      togglePlay();
    }
  }
  function onPlayerStateChange(event) {
    /** Yourube API
        -1 (unstarted)
         0 (ended)
         1 (playing)
         2 (paused)
         3 (buffering)
         5 (video cued)
        **/
    if (controlToggleTimeout !== null) {
      clearTimeout(controlToggleTimeout);
    }
    if (event.data === 0) {
      mediaBrowser.showControls();
    } else if (event.data === 1) {
      cp.field('nav-play').hide();
      cp.field('nav-pause').show();
      controlToggleTimeout = setTimeout(function() {
        mediaBrowser.hideControls();
      }, 2500);
    } else if (event.data === 2) {
      cp.field('nav-play').show();
      cp.field('nav-pause').hide();
    }
  }

  function playVideo() {
    player.playVideo();
    isPlaying = true;
  }
  function stopVideo() {
    player.stopVideo();
    isPlaying = false;
  }
  function pauseVideo() {
    player.pauseVideo();
    isPlaying = false;
    mediaBrowser.showControls();
  }

  function togglePlay() {
    if (!isPlaying) {
      playVideo();
    } else {
      pauseVideo();
    }
  }
}

module.exports = VideoItem;
