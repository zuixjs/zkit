"use strict";
zuix.controller(function (cp) {
    let mediaBrowser;
    let player;
    let isPlaying = false;

    cp.create = function () {
        cp.expose('host', setHost);
        cp.field('overlay').on('click', function () {
            if (mediaBrowser.current() == cp.view().attr('data-index'))
                togglePlay();
        });
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
        if (mediaBrowser.current() == cp.view().attr('data-index'))
            togglePlay();
    }
    function onPlayerStateChange(event) {
        // TODO: ...
    }

    function playVideo() {
        if (player && player.playVideo) {
            player.playVideo();
            isPlaying = true;
            mediaBrowser.hideList();
        }
    }
    function stopVideo() {
        if (player && player.stopVideo) player.stopVideo();
        isPlaying = false;
    }
    function pauseVideo() {
        if (player && player.pauseVideo()) player.pauseVideo();
        mediaBrowser.showList();
    }

});