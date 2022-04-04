'use strict';

/**
 * YouTubeVideoItem class.
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
function YouTubeVideoItem(cp) {
  let mediaBrowser;
  let player;
  let controlsHideTimeout;
  let pageIndex = -1;

  cp.create = function() {
    pageIndex = +cp.view().attr('data-index');
    // expose public methods
    cp.expose('host', setHost);
    cp.expose('setup', setPlayer);
    cp.expose('play', play);
    cp.expose('pause', pause);
    cp.expose('stop', stop);
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

  // YouTube Player API

  function setPlayer() {
    const videoUrl = cp.field('url').attr('href') || cp.field('url').html();
    player = new YT.Player(cp.field('player').get(), {
      height: '100%',
      width: '100%',
      playerVars: {controls: 1, disablekb: 1, fs: 0, modestbranding: 0, rel: 0, showinfo: 0, ecver: 2},
      videoId: parseVideoId(videoUrl),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    return player;
  }

  function onPlayerReady(event) {
    const controls = cp.field('player-controls');
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
        const ps = player.getPlayerState();
        if (isActive() && (ps === 1 || ps === 3)) {
          pause();
        }
      },
      'refresh:active': function() {
        const ps = player.getPlayerState();
        if (isActive() && ps !== 1 && ps !== 3) {
          play();
        }
      }
    });
    if (mediaBrowser.current() === pageIndex) {
      play();
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
    if (controlsHideTimeout !== null) {
      clearTimeout(controlsHideTimeout);
    }
    if (event.data === 0) {
      mediaBrowser.showControls();
    } else if (event.data === 1) {
      cp.field('nav-play').hide();
      cp.field('nav-pause').show();
      controlsHideTimeout = setTimeout(function() {
        mediaBrowser.hideControls();
      }, 2500);
    } else if (event.data === 2) {
      cp.field('nav-play').show();
      cp.field('nav-pause').hide();
    }
  }

  function play() {
    player.playVideo();
  }
  function pause() {
    player.pauseVideo();
  }
  function stop() {
    player.stopVideo();
  }

  // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
  function parseVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url;
  }
}

module.exports = YouTubeVideoItem;
