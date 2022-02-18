'use strict';

/**
 * VideoItem class.
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function VideoItem() {
  let mediaBrowser;
  let player;
  let isPlaying = false;
  let controlToggleTimeout;
  const cp = this;

  cp.create = function() {
    cp.field('overlay').on('click', function(e) {
      if (!e.cancelBubble && mediaBrowser.current() == cp.view().attr('data-index')) {
        if (controlToggleTimeout !== null) {
          clearTimeout(controlToggleTimeout);
        }
        mediaBrowser.toggleControls();
      }
    });
    cp.field('play').on('click', function(e) {
      e.cancelBubble = true;
      playVideo();
    }).hide();
    cp.field('pause').on('click', function(e) {
      e.cancelBubble = true;
      pauseVideo();
    }).hide();
    cp.field('controls').hide();
    cp.expose('host', setHost);
  };

  function setHost(view) {
    mediaBrowser = zuix.context(view);
    mediaBrowser.youtubeApi(youtubeReadyCallback);
    view.on('page:change', pageChanged)
        .on('open', function() {
          if (mediaBrowser.current() == cp.view().attr('data-index')) {
            playVideo();
          }
        })
        .on('close', function() {
          pauseVideo();
        })
        .on('controls:show', function() {
          cp.field('player-controls').animateCss('fadeInDown').show();
        })
        .on('controls:hide', function() {
          cp.field('player-controls').animateCss('fadeOutUp', function() {
            this.hide();
          });
        });
  }

  function pageChanged(e) {
    const page = e.detail;
    if (page.out == cp.view().attr('data-index')) {
      pauseVideo();
    } else if (page.in == cp.view().attr('data-index')) {
      playVideo();
    }
  }

  // YouTube Player API

  function youtubeReadyCallback() {
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
  }

  function togglePlay() {
    if (!isPlaying) {
      playVideo();
    } else {
      isPlaying = false;
      pauseVideo();
    }
  }

  function onPlayerReady(event) {
    if (mediaBrowser.current() == cp.view().attr('data-index')) {
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
      cp.field('play').hide();
      cp.field('pause').show();
      controlToggleTimeout = setTimeout(function() {
        mediaBrowser.hideControls();
      }, 2500);
    } else if (event.data === 2) {
      cp.field('play').show();
      cp.field('pause').hide();
    }
  }

  function playVideo() {
    if (player && player.playVideo) {
      player.playVideo();
      isPlaying = true;
    }
  }
  function stopVideo() {
    if (player && player.stopVideo) {
      player.stopVideo();
    }
    isPlaying = false;
  }
  function pauseVideo() {
    if (player && player.pauseVideo) {
      player.pauseVideo();
    }
    mediaBrowser.showControls();
  }
}

module.exports = VideoItem;
