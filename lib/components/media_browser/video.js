"use strict";
zuix.controller(function (cp) {
    let mediaBrowser;
    let player;
    let isPlaying = false;

    cp.create = function () {
        cp.expose('host', setHost);
        cp.field('overlay').on('click', function () {
            if (mediaBrowser.current() == cp.view().attr('data-index')) togglePlay();
        });
    };

    function setHost(view) {
        view.on('page:change', pageChanged);
        mediaBrowser = zuix.context(view);
        mediaBrowser.youtubeApi(youtubeReadyCallback);
    }

    function pageChanged(e) {
        let page = e.detail;
        if (page.out == cp.view().attr('data-index')) {
            pauseVideo();
        } else if (page.in == cp.view().attr('data-index')) {
            //if (isPlaying)
                playVideo();
        }
    }

    // YouTube Player API

    function youtubeReadyCallback() {
        player = new YT.Player(cp.field('player').get(), {
            height: '100%',
            width: '100%',
            playerVars: { controls: 1, disablekb: 1, fs: 0, modestbranding: 0, rel: 0, showinfo: 0},
            videoId: cp.field('embed').html(),
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
        // TODO: ...
    }
    function onPlayerStateChange(event) {
        // TODO: ...
    }

    function playVideo() {
        isPlaying = true;
        player.playVideo();
    }
    function stopVideo() {
        isPlaying = false;
        player.stopVideo();
    }
    function pauseVideo() {
        player.pauseVideo();
    }

});