let vjsPlayer;
let scripts;

function register({ registerHook, peertubeHelpers }) {
    init(registerHook, peertubeHelpers)
        .catch(err => console.error('Cannot init', err))
}

export {
    register
}

function init(registerHook, peertubeHelpers) {
    return peertubeHelpers.getSettings()
        .then(s => {
            const { notifier } = peertubeHelpers;

            scripts = Array
                .from(document.querySelectorAll('script'))
                .map(scr => scr.src);

            if (!scripts.includes('https://cdn.jsdelivr.net/npm/video.js@7.7.4/dist/video.min.js')) {
                loadJS('https://cdn.jsdelivr.net/npm/video.js@7.7.4/dist/video.min.js', videojsLoaded, document.head);
            } else {
                console.log('videojs already loaded');
            }
            console.log('scripts :>> ', scripts);

            registerHook({
                target: 'action:video-watch.video.loaded',
                handler: ({ video }) => {
                    //  console.log('video hooked info :>> ', video);
                }
            })

            registerHook({
                target: "action:video-watch.player.loaded",
                handler: ({ player, videojs, video }) => {

                    //  console.log('peertube hooked info :>> ', player, videojs, video);
                    console.log('video.tags :>> ', video.tags);

                    const compliant360 = video.tags.find(element => {
                        if (element.includes('360:')) {
                            return true;
                        }
                    });

                    player.player_.pause();

                    if (compliant360 !== undefined) {

                        peertubeHelpers.showModal({
                            title: 'Interactive video',
                            content: '<p>This seems to be a 360° video.</p><p>-Click and drag your mouse to interact with the video</p><p>OR</p><p>-Move your head if you have a VR headset.</p>',
                            close: true,
                            //  cancel: { value: 'cancel', action: () => {} },
                            confirm: {
                                value: 'Ok',
                                action: () => {
                                    goForVrPlayer(notifier, video);
                                }
                            },
                        })
                    }
                }
            })
        })
}

var loadJS = function(url, implementationCode, location) {
    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    location.appendChild(scriptTag);
};

var videojsLoaded = function() {
    console.log('videojs is loaded');
    if (!scripts.includes('https://cdn.jsdelivr.net/npm/videojs-vr@1.7.2/dist/videojs-vr.min.js')) {
        loadJS('https://cdn.jsdelivr.net/npm/videojs-vr@1.7.2/dist/videojs-vr.min.js', videojsvrLoaded, document.head);
    } else {
        console.log('videojsVR already loaded');
    }
}

var videojsvrLoaded = function() {
    console.log('videojs-vr is loaded');
}

var goForVrPlayer = function(notifier, video) {

    vjsPlayer = videojs(document.querySelector('.video-js video'));
    vjsPlayer.mediainfo = vjsPlayer.mediainfo || {};

    if (video.tags.includes('360:180')) {
        vjsPlayer.mediainfo.projection = '180';
    } else if (video.tags.includes('360:180_LR')) {
        vjsPlayer.mediainfo.projection = '180_LR';
    } else if (video.tags.includes('360:180_MONO')) {
        vjsPlayer.mediainfo.projection = '180_MONO';
    } else if (video.tags.includes('360:180_LR')) {
        vjsPlayer.mediainfo.projection = '180_LR';
    } else if (video.tags.includes('360:360')) {
        vjsPlayer.mediainfo.projection = '360';
    } else if (video.tags.includes('360:Cube')) {
        vjsPlayer.mediainfo.projection = 'Cube';
    } else if (video.tags.includes('360:360_CUBE')) {
        vjsPlayer.mediainfo.projection = '360_CUBE';
    } else if (video.tags.includes('360:360_LR')) {
        vjsPlayer.mediainfo.projection = '360_LR';
    } else if (video.tags.includes('360:360_TB')) {
        vjsPlayer.mediainfo.projection = '360_TB';
    } else if (video.tags.includes('360:EAC')) {
        vjsPlayer.mediainfo.projection = 'EAC';
    } else if (video.tags.includes('360:EAC_LR')) {
        vjsPlayer.mediainfo.projection = 'EAC_LR';
    }

    vjsPlayer.vr({ projection: 'AUTO', sphereDetail: 32, debug: true, forceCardboard: false });

    console.log('mediainfo.projection :>> ', vjsPlayer.mediainfo.projection);

    vjsPlayer.play();

    console.log('switch to videojs-vr Player');
    notifier.success('Switched to 360° video player')
}