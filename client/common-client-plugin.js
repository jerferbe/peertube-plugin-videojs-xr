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


        
            // registerHook({
            //     target: 'action:router:navigation-end',
            //     handler: () => {
            //         console.log('router navigation-end');
            //     }
            // })

            registerHook({
                target: 'action:embed.player.loaded',
                handler: ({ videojs, video }) => {
                    // Fired when the embed loaded the player
                    console.log('loaded peertube embed player:>> ', video);
                }
            })

            registerHook({
                target: 'action:video-watch.video.loaded',
                handler: ({ videojs, video }) => {
                    // console.log('video loaded hooked info :>> ', videojs, video);

                    window.videojs = videojs;


                    scripts = Array
                    .from(document.querySelectorAll('script'))
                    .map(scr => scr.src);

                    console.log('scripts :>> ', scripts);


                    if (!scripts.includes('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js')) {
                        loadJS('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js', videojsxrLoaded(notifier, video, window.videojs), document.head);
                    } else {
                        console.log('videojsXR already loaded');
                        videojsxrLoaded(notifier, video, window.videojs)
                    }

                }
            })

            registerHook({
                target: "action:video-watch.player.loaded",
                handler: ({ player, videojs, video }) => {


                   


                    // console.log('player loaded hooked info :>> ', player, videojs, video);
                    console.log('video tags :>> ', video.tags);



                    // vjsPlayer.reset();
                    // vjsPlayer.controlBar.addChild('CardboardButton', {});

                    // var vrDisplay = new CardboardVRDisplay();
                    // var canvas = document.querySelector('canvas');

                    // var myButton = vjsPlayer.controlBar.addChild('button', {});
                    // var myButtonDom = myButton.el();
                    // myButtonDom.innerHTML = '????';
                    // myButtonDom.onclick = function() {
                    //     // window.dispatchEvent(new window.Event('vrdisplayactivate'));
                    //     alert('enter vr mode');
                    //     window.addEventListener('vrdisplayactivate', function() {
                    //         renderer.vr.getDevice().requestPresent([{ source: renderer.domElement }])
                    //     });

                    // };


                    // vjsPlayer.ready(function() {
                    //     var promise = vjsPlayer.play();
                    //     if (promise !== undefined) {
                    //         promise.then(function() {
                    //             // Autoplay started!
                    //             vjsPlayer.pause();
                    //             vjsPlayer.controls = false;
                    //         }).catch(function(error) {
                    //             // Autoplay was prevented.
                    //             vjsPlayer.pause();
                    //             vjsPlayer.controls = false;
                    //         });
                    //     }
                    // });

                    // peertubeHelpers.showModal({
                    //     title: 'This seems to be a 360?? video',
                    //     content: '<p>-Click and drag your mouse to interact with the video</p><p>OR</p><p>-Move your head if you have a VR headset.</p>',
                    //     close: true,
                    //     //  cancel: { value: 'cancel', action: () => {} },
                    //     confirm: {
                    //         value: 'Ok',
                    //         action: () => {
                    //             goForVrPlayer(notifier, video);
                    //         }
                    //     },
                    // })
                    // }
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

// var videojsLoaded = function() {
//     console.log('videojs 7.10.2 is loaded');
//     if (!scripts.includes('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js')) {
//         loadJS('https://cdn.jsdelivr.net/npm/videojs-xr@0.1.0/dist/videojs-xr.min.js', videojsxrLoaded, document.head);
//     } else {
//         console.log('videojsXR already loaded');
//     }
// }

var videojsxrLoaded = function(notifier, video, videojs) {
    console.log('videojs-xr 0.1.0 is loaded');
    // if (!scripts.includes('https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js')) {
    //     loadJS('https://cdn.jsdelivr.net/npm/webxr-polyfill@latest/build/webxr-polyfill.js', webxrPolyfillLoaded, document.head);
    // } else {
    //     console.log('webxr-polyfill already loaded');
    // }
    // 
    let isCompliant360;
    isCompliant360 = video.tags.find(element => {
        if (element.includes('360:')) {
            return true;
        }
    });

    if (isCompliant360 !== undefined) {
        setTimeout(() => {
     
            goForVrPlayer(notifier, video, videojs);
           
        }, 100);
    }
}

// var webxrPolyfillLoaded = function() {
//     console.log('webxr-polyfill is loaded');
// }

var goForVrPlayer = function(notifier, video, videojs) {

    console.log('goForVrPlayer :>> ');

    document.getElementById('videojs-wrapper').children[0].classList.remove('vjs-peertube-skin');
    // document.getElementById('videojs-wrapper').children[0].classList.add('vjs-default-skin');

 
    // const videoParent = document.getElementById("vjs_video_3");
    // const chil = videoParent.querySelectorAll(":scope > .vjs-control-bar");

    vjsPlayer = videojs(document.querySelector('video'), {
        autoplay: false,
        posterImage: true,
        controls: true,
        forceCardboard: false
    });
    console.log('vjsPlayer :>> ', vjsPlayer);

 
    setTimeout(() => {
        vjsPlayer.xr({ projection: 'AUTO' });
    }, 100);
    
   

    // var polyfill = new WebXRPolyfill({
    //     cardboard: true,
    //     allowCardboardOnDesktop: true,
    // });

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

    // vjsPlayer.xr({ projection: 'AUTO', debug: true, forceCardboard: true });
    



    // vjsPlayer.xr().on('initialized', () => {
    //     vjsPlayer.xr().projection = vjsPlayer.mediainfo.projection;
    //     // vjsPlayer.xr({projection: '360'});
    //     console.log('"xr" in navigator :>> ', "xr" in navigator);
    //     console.log('trying to switch projection type to : ' + vjsPlayer.mediainfo.projection);
    //     notifier.success('Switched to 360?? video player');
    // });

}