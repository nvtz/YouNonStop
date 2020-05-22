import initGoogleAPI from './gapi';
import loadYoutubeIframeAPI from './ytapi';
import randomSearchQuery from './query';
import loadYouNonStop from './app';
import Modals from './modals';
// Include css styles
import style from '../assets/css/style.css';
// Social buttons
import bootstrapButtonStyle from '../assets/libs/bootstrap-social-buttons/1.0.0/social-buttons.css';

(function ($, window, document) {
    // Initialize YouNonStop
    loadYouNonStop(
        $('#playerControls'),
        $('div.navbar-wrapper'),
        $('#search'),
        randomSearchQuery()
    );

    // Initialize Modal Dialogs
    Modals.init($('#about'), $('#contact'), $('#shortcuts'));

    // Load Youtube Iframe API
    loadYoutubeIframeAPI(window.document);
}(jQuery, window, document));
