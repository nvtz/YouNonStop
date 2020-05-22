export default function loadYoutubeIframeAPI(document) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

window.onYouTubeIframeAPIReady = function () {
    var YouNonStopPlayer = new YT.Player('younonstopplayer', {
        height: '100%',
        width: '100%',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onError
        },
        playerVars: {
            'disablekb': 1,
            'enablejsapi': 1,
            'fs': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'rel': 0,
            'color': 'white',
            'autoplay': 1,
            'controls': 0,
            'autohide': 1,
            'wmode': 'opaque',
            'origin': __DOMAIN__
        },
    });
    var younonstop = window.YouNonStop;
    younonstop.setPlayer.call(younonstop, YouNonStopPlayer);
}

window.stopVideo = function () {
    var younonstop = window.YouNonStop;
    window.console.warn('Unable to stop video');
    // TODO: Implemen stop video event
    // younonstop.stopVideo.call(younonstop, event);
}

window.onPlayerReady = function (event) {
    var younonstop = window.YouNonStop;
    younonstop.onPlayerReady.call(younonstop, event);
}

window.onPlayerStateChange = function (event) {
    var younonstop = window.YouNonStop;
    younonstop.onPlayerStateChange.call(younonstop, event.data);
}

window.onError = function (event) {
    var younonstop = window.YouNonStop;
    younonstop.onPlayerError.call(younonstop, e);
}
