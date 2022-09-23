let scripts;
let vjsPlayer;

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

            if (!scripts.includes('https://cdn.jsdelivr.net/npm/video.js@7.10.2/dist/video.min.js')) {
                loadJS('https://cdn.jsdelivr.net/npm/video.js@7.10.2/dist/video.min.js', videojsLoaded, document.head);
            } else {
                console.log('videojs already loaded');
            }
            console.log('scripts :>> ', scripts);

            registerHook({
                target: 'action:video-watch.video.loaded',
                handler: ({ videojs, video }) => {
                    // console.log('video loaded hooked info :>> ', videojs, video);
                }
            })

            registerHook({
                target: "action:video-watch.player.loaded",
                handler: ({ player, videojs, video }) => {

                    // console.log('player loaded hooked info :>> ', player, videojs, video);
                    console.log('video tags :>> ', video.tags);

                    const compliant360 = video.tags.find(element => {
                        if (element.includes('360:')) {
                            return true;
                        }
                    });

                    if (compliant360 !== undefined) {

                        vjsPlayer = videojs(document.querySelector('.video-js video'), {
                            autoplay: false,
                            posterImage: false,
                            controls: false
                        });

                        vjsPlayer.ready(function() {
                            var promise = vjsPlayer.play();
                            if (promise !== undefined) {
                                promise.then(function() {
                                    // Autoplay started!
                                    vjsPlayer.pause();
                                    vjsPlayer.controls = false;
                                }).catch(function(error) {
                                    // Autoplay was prevented.
                                    vjsPlayer.pause();
                                    vjsPlayer.controls = false;
                                });
                            }
                        });

                        peertubeHelpers.showModal({
                            title: 'This seems to be a 360° video',
                            content: '<p>-Click and drag your mouse to interact with the video</p><p>OR</p><p>-Move your head if you have a VR headset.</p>',
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
    console.log('videojs 7.10.2 is loaded');
    if (!scripts.includes('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js')) {
        loadJS('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js', videojsvrLoaded, document.head);
    } else {
        console.log('videojsXR already loaded');
    }
}

var videojsvrLoaded = function() {
    console.log('videojs-xr 0.1.0 is loaded');
}

var goForVrPlayer = function(notifier, video) {

    document.getElementById('videojs-wrapper').children[0].classList.remove('vjs-peertube-skin', 'vjs-has-starte');
    vjsPlayer = videojs(document.querySelector('.video-js video'));

    vjsPlayer.mediainfo = vjsPlayer.mediainfo || {};

    if (video.tags.includes('360:180')) {
        vjsPlayer.mediainfo.projection = '180';
    } else if (video.tags.includes('360:180_LR')) {
        vjsPlayer.mediainfo.projection = '180_LR';
    } else if (video.tags.includes('360:180_MONO')) {
        vjsPlayer.mediainfo.projection = '180_MONO';
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

    vjsPlayer.xr({ projection: 'AUTO', debug: true, forceCardboard: true });

    vjsPlayer.xr().on('initialized', () => {
        vjsPlayer.xr().projection = vjsPlayer.mediainfo.projection;
        console.log('switch to videojs-xr player with ' + vjsPlayer.mediainfo.projection + ' projection');
        notifier.success('Switched to 360° video player');
    });

}