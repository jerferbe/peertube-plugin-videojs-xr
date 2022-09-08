 // video-vr.js module
 //  import videojs from 'video.js';
 //  import 'videojs-vr/dist/videojs-vr.css';
 //  import 'videojs-vr/dist/videojs-vr.min.js';
 var vjsPlayer;

 function register({ registerHook, peertubeHelpers }) {
     loadJS('https://videojs-vr.netlify.app/node_modules/video.js/dist/video.js', videojsLoaded, document.head);

     init(registerHook, peertubeHelpers)
         .catch(err => console.error('Cannot init', err))

 }


 export {
     register
 }


 function init(registerHook, peertubeHelpers) {
     return peertubeHelpers.getSettings()
         .then(s => {

             // console.log('peertubeHelpers settings --->', s, s['watermark-image-url']);

             registerHook({
                 target: 'action:video-watch.video.loaded',
                 handler: () => {
                     // displayHelloWorld()
                     // displayMediaProjection();
                 }
             })
             const { notifier } = peertubeHelpers

             registerHook({
                 target: "action:video-watch.player.loaded",
                 handler: ({ player, videojs, video }) => {

                     console.log('peertube hooked info :>> ', player, videojs, video);
                     vjsPlayer = videojs(document.querySelector('.vjs-tech'), { autoplay: false });

                     if (video.tags.includes('360')) {

                         peertubeHelpers.showModal({
                             title: 'VR interactive video',
                             content: '<p>Hoow this seems to be a 360-degrees video.</p><p>Click and drag your mouse to interact with the video.</p>',
                             close: true,
                             //  cancel: { value: 'cancel', action: () => {} },
                             confirm: {
                                 value: 'Ok',
                                 action: () => {
                                     goForVrPlayer(notifier);
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
     loadJS('https://videojs-vr.netlify.app/dist/videojs-vr.js', videojsvrLoaded, document.head);
 }
 var videojsvrLoaded = function() {
     console.log('videojs-vr is loaded');
 }
 var goForVrPlayer = function(notifier) {

     //  vjsPlayer = videojs('vjs_video_3_html5_api');
     vjsPlayer = videojs(document.querySelector('.vjs-tech'), { autoplay: false });
     //  vjsPlayer.options.autoplay = false;

     vjsPlayer.vr({ projection: '360' });

     console.log('switch to videojs-vr Player');
     notifier.success('Switch to VR Player')

     //  console.log('projection type :>> ', vjsPlayer.mediainfo.projection);


 }




 function displayHelloWorld() {
     console.info('Hellow..');
 }