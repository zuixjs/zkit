"use strict";
zuix.controller(function (cp) {
    let mediaBrowser;
    let player;
    let isPlaying = false;
    let controlToggleTimeout;

    cp.create = function () {
        cp.field('overlay').on('click', function () {
            if (mediaBrowser.current() == cp.view().attr('data-index'))
                togglePlay();
        });
        cp.expose('host', setHost);
    };

    function setHost(view) {
        view.on('page:change', pageChanged)
            .on('open', function () {
                if (mediaBrowser.current() == cp.view().attr('data-index'))
                    playVideo();
            })
            .on('close', function () {
                pauseVideo();
            });
        mediaBrowser = zuix.context(view);
        mediaBrowser.youtubeApi(youtubeReadyCallback);
    }

    function pageChanged(e) {
        let page = e.detail;
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
            playerVars: { controls: 1, disablekb: 1, fs: 0, modestbranding: 0, rel: 0, showinfo: 0},
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
        if (mediaBrowser.current() == cp.view().attr('data-index'))
            togglePlay();
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
        if (controlToggleTimeout !== null)
            clearTimeout(controlToggleTimeout);
        if (event.data === 0) {
            mediaBrowser.showControls();
        } else if (event.data === 1) {
            controlToggleTimeout = setTimeout(function () {
                mediaBrowser.hideControls();
            },2500);
        }
    }

    function playVideo() {
        if (player && player.playVideo) {
            player.playVideo();
            isPlaying = true;
        }
    }
    function stopVideo() {
        if (player && player.stopVideo)
            player.stopVideo();
        isPlaying = false;
    }
    function pauseVideo() {
        if (player && player.pauseVideo())
            player.pauseVideo();
        mediaBrowser.showControls();
    }

});