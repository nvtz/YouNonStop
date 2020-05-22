var YouNonStop = {
    // TODO: Use YT.PlayerState
    playerStates: {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5
    },

    keyCodes: {
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        PLAYPAUSE: ' '.charCodeAt(0),
        MUTE0: 'M'.charCodeAt(0),
        MUTE1: 'm'.charCodeAt(0),
        FULLSCREEN0: 'F'.charCodeAt(0),
        FULLSCREEN1: 'f'.charCodeAt(0),
        REPEAT0: 'R'.charCodeAt(0),
        REPEAT1: 'r'.charCodeAt(0)
    },

    init: function (options, playerControls, navBar, searchInput, defaultSearch) {
        var that = this;
        this.initDbg(options);

        this.player = null;
        this.playerControls = playerControls;
        this.navBar = navBar;
        this.searchInput = searchInput;
        this.currentVideo = '';
        this.searchResults = [];
        this.repeat = false;
        this.uiVisibilty = true;
        // Hack: False mouse move event on fadeOut event
        // TODO: If it's still valid
        this.firstMouseMove = 0;
        this.bindEvents();
        this.dataApiParams = undefined;
        this.suggestionsApiParams = undefined;
        this.query = defaultSearch;
        this.suggestion = undefined;
        this.prevQuery = ''
        this.searchInput.val(this.getHash() || this.query);
        this.options = $.extend({}, options);
        this.playerControls.on('click', 'a', function () {
            that.mouseController.apply(that, arguments);
        });
        return this;
    },

    setPlayer: function (player) {
        this.player = player;
    },

    bindEvents: function () {
        this.searchInput.on('keyup', this.search);
        $('body').mousemove(this.mouseMoveEvent);
        $('body').on('keyup', this.keyboardEvent);
        $(window).resize(this.resizeEvent);
    },

    mouseMoveEvent: function (e) {
        var self = YouNonStop;

        self.debug('mouseMoveEvent: Mouse Moved!');
        self.toggleUI('mouse', e);
    },

    keyboardEvent: function (e) {
        var self = YouNonStop,
            kc = self.keyCodes;

        self.debug('keyboardEvent: Key Pressed ' + e.keyCode);
        self.debug(e);

        switch (e.keyCode) {
            case kc.LEFT_ARROW:
            case kc.RIGHT_ARROW:
            case kc.PLAYPAUSE:
            case kc.MUTE0:
            case kc.MUTE1:
            case kc.FULLSCREEN0:
            case kc.FULLSCREEN1:
            case kc.REPEAT0:
            case kc.REPEAT1:
                self.keyboardController.call(self, e);
            // follow on
            case kc.UP_ARROW:
            case kc.DOWN_ARROW:
            default:
                self.toggleUI('keyboard', e);
                break;
        }
    },

    resizeEvent: function (e) {
        YouNonStop.controller('resize');
    },

    toggleUI: function (actor, e) {
        var self = YouNonStop,
            uiTimeout = 10000,
            keyCode = e.keyCode;
        if (actor === 'keyboard' && keyCode == self.keyCodes.DOWN_ARROW) {
            uiTimeout = 100;
            if (!self.uiVisibilty) {
                return;
            }
        }

        clearTimeout(self.uiTimer);

        self.uiTimer = setTimeout(function () {
            if (self.uiVisibilty) {
                self.debug('toggleUI: ' + 'hiding UI');
                self.navBar.fadeOut('slow');
                self.playerControls.fadeOut('slow');
                self.uiVisibilty = false;
                self.searchInput.blur();

                // Hack: False mouse move event on fadeOut event
                if (actor === 'mouse' && self.firstMouseMove === 0) {
                    self.firstMouseMove++;
                }
            }
        }, uiTimeout);

        if (self.uiVisibilty) {
            if (keyCode == self.keyCodes.UP_ARROW) {
                self.searchInput.focus();
            }
            return;
        }

        if (actor == 'mouse' && self.firstMouseMove === 1) {
            self.firstMouseMove++;
            return;
        }

        self.debug('toggleUI: ' + 'showing UI');

        self.playerControls.fadeIn('slow');
        self.navBar.fadeIn('slow');
        self.uiVisibilty = true;
    },

    search: function (e) {
        var self = YouNonStop,
            kc = self.keyCodes,
            input = this;

        if (typeof e !== "undefined") {
            if (e.keyCode !== kc.UP_ARROW && e.keyCode !== kc.DOWN_ARROW) {
                self.debug('search: Stopping Propagation');
                e.stopPropagation();
                self.toggleUI('keyboard', e);
            }
        }

        clearTimeout(self.searchTimer);
        self.searchTimer = (input.value.length >= 4) && (input.value !== self.prevQuery) && setTimeout(function () {
            self.query = input.value;
            self.fetchSuggestions().done(function (suggestions) {
                if (suggestions[1][0]) {
                    self.suggestion = suggestions[1][0][0];
                    self.debug('Suggestion: ' + self.suggestion);

                } else {
                    self.suggestion = self.query;
                }

                self.fetchResults().done(function (results) {
                    if (results.items) {
                        self.searchResults = $.map(results.items, function (item) {
                            return item.id.videoId;
                        });
                        self.debug('searchTimer: ' + self.searchResults);
                        self.prevQuery = self.query;
                        self.playNext();
                        self.updateHash();
                    }
                });
            });
        }, 500);
    },

    getHash: function () {
        return window.location.hash ? $('<div/>').text(decodeURIComponent(window.location.hash.substring(1))).html() : '';
    },

    updateHash: function () {
        window.location.replace('#' + encodeURI(this.query));
    },

    fetchSuggestions: function () {
        var apiUrl = this.buildSuggestionsApiURL();
        this.debug('fetchSuggestions: ' + apiUrl);
        return $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'jsonp'
        });
    },

    fetchResults: function () {
        var apiUrl = this.buildDataApiURL();
        this.debug('fetchResults: ' + apiUrl);
        return $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'jsonp'
        });
    },

    play: function (vId) {
        this.debug('play: ' + vId);
        if (this.player) {
            this.currentVideo = vId;
            this.player.loadVideoById(vId);
            this.player.playVideo();
        } else {
            this.debug('Unable to find player');
        }
    },

    playNext: function () {
        var results = this.searchResults,
            index = results.indexOf(this.currentVideo),
            length = results.length,
            vId = '';

        this.debug('playNext: ' + 'currentVideo ' + this.currentVideo + ', index ' + index + ', length ' + length);
        if (length) {
            if (index == length - 1) {
                index = -1;
            }
            this.play(results[index + 1]);
        }
    },

    playPrev: function () {
        var results = this.searchResults,
            index = results.indexOf(this.currentVideo),
            length = results.length,
            vId = '';
        this.debug('playPrev: ' + 'currentVideo ' + this.currentVideo + ', index ' + index + ', length ' + length);

        if (length) {
            if (index === 0) {
                index = length;
            }
            this.play(results[index - 1]);
        }
    },

    buildSuggestionsApiURL: function (options) {
        var url = 'https://suggestqueries.google.com/complete/search';
        var apiUrl = '';
        var apiParams = '';
        var opts = this.options["suggestionsAPIOptions"];

        if (typeof options !== "undefined") {
            opts = $.extend(opts, options);
        }

        if (typeof this.suggestionsApiParams !== 'undefined') {
            apiParams = this.suggestionsApiParams;
        } else {
            for (var v in opts) {
                apiParams += '&' + v + '=' + opts[v];
            }
            this.suggestionsApiParams = apiParams;
        }

        apiUrl = [url, '?', 'q=', encodeURIComponent(this.query), apiParams].join('');
        this.debug('buildSuggestionsApiURL: ' + apiUrl);
        return apiUrl;

    },

    buildDataApiURL: function (options) {
        var url = 'https://www.googleapis.com/youtube/v3/search';
        var apiUrl = '';
        var apiParams = '';
        var opts = {
            part: "snippet",
            maxResults: 25,
            type: "video",
            videoEmbeddable: "true",
            key: __GOOGLE_API_KEY__
        }

        if (typeof options !== "undefined") {
            opts = $.extend(opts, options);
        }

        if (typeof this.dataApiParams !== 'undefined') {
            apiParams = this.dataApiParams;
        } else {
            for (var v in opts) {
                apiParams += '&' + v + '=' + opts[v];
            }
            this.dataApiParams = apiParams;
        }

        apiUrl = [url, '?', 'q=', encodeURIComponent(this.suggestion), apiParams].join('');
        this.debug('buildDataApiURL: ' + apiUrl);
        return apiUrl;
    },

    keyboardController: function (e) {
        this.controller(e.keyCode);
    },

    mouseController: function (e) {
        var ctrl = $(e.currentTarget),
            command = ctrl.data('control');
        this.debug(e);
        e.preventDefault();
        this.controller(command, ctrl);
    },

    controller: function (command, control) {
        var player = this.player,
            kc = this.keyCodes,
            status = false,
            playerState = 0,
            ahref,
            icon;
        this.debug('controller: Command: ' + command + ', Control: ' + typeof control);
        if (!player) {
            this.debug('Unable to find player');
            return;
        }

        switch (command) {
            case 'playpause':
            case kc.PLAYPAUSE:
                ahref = control || $(this.playerControls).find('[data-control="playpause"]');
                icon = $(ahref).find('.fa');
                playerState = player.getPlayerState();

                if (playerState == this.playerStates.PLAYING) {
                    player.pauseVideo();
                    icon.removeClass('fa-pause').addClass('fa-play');

                } else if (playerState = this.playerStates.PAUSED) {
                    player.playVideo();
                    icon.removeClass('fa-play').addClass('fa-pause');
                }
                break;

            case 'next':
            case kc.RIGHT_ARROW:
                this.playNext();
                break;

            case 'previous':
            case kc.LEFT_ARROW:
                this.playPrev();
                break;

            case 'muteunmute':
            case kc.MUTE0:
            case kc.MUTE1:

                ahref = control || $(this.playerControls).find('[data-control="muteunmute"]');
                icon = $(ahref).find('.fa');
                status = player.isMuted();
                status ? player.unMute() : player.mute();
                status ? icon.removeClass('fa-volume-off').addClass('fa-volume-up') :
                    icon.removeClass('fa-volume-up').addClass('fa-volume-off');
                break;

            case 'resize':
            // Follow on to full screen
            case 'fullscreen':
            case kc.FULLSCREEN0:
            case kc.FULLSCREEN1:
                ahref = control || $(this.playerControls).find('[data-control="fullscreen"]');
                icon = $(ahref).find('.fa');

                var updateFullscreenIcon = function () {
                    var status = !document.fullscreenElement && !document.mozFullScreenElement &&
                        !document.webkitFullscreenElement && !document.mozFullscreenElement;
                    status ? icon.removeClass('fa-compress').addClass('fa-expand') :
                        icon.removeClass('fa-expand').addClass('fa-compress');
                };

                command === "resize" ? updateFullscreenIcon() : this.toggleFullscreen(updateFullscreenIcon);
                break;

            case 'repeat':
            case kc.REPEAT0:
            case kc.REPEAT1:
                ahref = control || $(this.playerControls).find('[data-control="repeat"]');
                icon = ahref.find('#text');
                this.repeat = !this.repeat;
                icon.text(this.repeat ? 'on' : 'off');
                break;
        }
    },

    toggleFullscreen: function (fn, element) {
        var callback = (typeof fn === "function" ? fn : false),
            el = element || document.documentElement;

        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.mozFullscreenElement) {
            this.debug('toggleFullScreen: ' + 'Entering full screen');
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (el.msRequestFullscreen) {
                el.msRequestFullscreen();
            }

            setTimeout(function () {
                // Request again if Element.ALLOW_KEYBOARD_INPUT fails
                if (!document.webkitFullscreenElement) {
                    (typeof el.webkitRequestFullscreen !== "undefined") && el.webkitRequestFullscreen();
                }
                callback && callback();
            }, 100)

        } else {
            this.debug('toggleFullScreen: ' + 'Exiting full screen');
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozExitFullScreen) {
                document.mozExitFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        callback && callback();
    },

    onPlayerReady: function (event) {
        this.debug('onPlayerReady: ' + event.target);
        this.playerControls.removeClass('hidden');
        $("#placeholder").removeClass('hidden');
        this.search.call(this.searchInput[0]);
    },

    onPlayerStateChange: function (playerState) {
        var results = this.searchResults,
            length = results.length;
        this.debug('onPlayerStateChange: ' + playerState);
        if (playerState == this.playerStates.ENDED) {
            this.repeat ? this.play(this.currentVideo) : this.playNext();
        }
    },

    onPlayerError: function (e) {
        this.debug('Error: ' + e);
        this.playNext();
    },

    initDbg: function (options) {
        const { debug } = options;
        if (typeof console === "object" && typeof console.log === "function" && debug) {
            this.debug = function (msg) { console.log(msg); };
        } else {
            this.debug = function (msg) { };
        }
    }
};

var defaultOptions = {
    "playerOptions": {
        ytPlayerURL: "https://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer&version=3&scale=0",
        playerWidth: "425",
        playerHeight: "356",
        swfVersion: "9.0.18",
        params: {
            allowScriptAccess: "always",
            wmode: "transparent"
        },
        atts: {
            id: 'ytplayer',
            allowFullScreen: 'true'
        }
    },

    "dataAPIOptions": {
        format: '5',
        'max-results': '10',
        'paid-content': false,
        v: '2',
        alt: 'jsonc'
    },

    "suggestionsAPIOptions": {
        cp: '1',
        ds: 'yt',
        client: 'youtube',
        hl: 'en',
        hjson: 't'
    },
    "DEBUG": false
};

export default function loadYouNonStop(playerControls, navBar, searchInput, defaultSearch, options) {
    if (!!options) {
        options = {}
    }
    options = $.extend({}, defaultOptions, options);
    window.YouNonStop = YouNonStop.init(options, playerControls, navBar, searchInput, defaultSearch);
};
