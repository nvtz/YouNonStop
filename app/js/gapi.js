function initGoogleAPI() {
    gapi.client.setApiKey(__GOOGLE_API_KEY__);
    gapi.client.load('youtube', 'v3').then(onYouTubeDataAPIReady);
}

export default initGoogleAPI;
