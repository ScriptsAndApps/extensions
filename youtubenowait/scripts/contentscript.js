setInterval(dontSleep, 2000);
	console.log('Started');
function gv(){
	try{
		let video = document.querySelector('video');
		//	console.log('Video is null');
		if(video!=null){
			console.log('not null');
			video.addEventListener('ended', (event) => {
				console.log('Video stopped either because 1) it was over, or 2) no further data is available.');
				 try{
					let d =document.querySelector(".ytp-autonav-endscreen-upnext-play-button");
					if(d!=null&&d.href!=""){
						
							console.log('Video is ended');
							window.location=document.querySelector(".ytp-autonav-endscreen-upnext-play-button").href;		
					}
				}catch{}
			});
		}else{
			setTimeout(gv, 200);
			console.log('trying timer');
		}
	}
	catch(e){ console.log('e'); setTimeout(gv, 2000); }

}
gv();
	console.log('gv');
function dontSleep(){
	try{
			//console.log('try popup');
    let popup = document.getElementById('confirm-button');
    if(popup != null){
		let parent = popup.parentNode.parentNode.parentNode.parentNode;
    
		if (popup != null && getComputedStyle(parent).display != "none"){
			popup.click();
		}
	}
	}catch{}
	try{
		let d =document.querySelector(".ytp-autonav-endscreen-upnext-play-button");
		
		let current = document.querySelector('span.ytp-time-current').textContent;
			let duration = document.querySelector('span.ytp-time-duration').textContent;
			//console.log(current +"-"+ duration+"=="+(current == duration));
		if(d!=null&&d.href!=""){
			//console.log('try video is ended new location');
			
		
			if (current == duration) {
				console.log('Video is ended');
				window.location=document.querySelector(".ytp-autonav-endscreen-upnext-play-button").href;	
			
			}
					
						
		}
	}catch{}
}
	


			console.log('script nnonstop');


var Injection =
  '(' +
  function () {
    const tag = '[Youtube NoStop]';
    const isYoutubeMusic = window.location.hostname === 'music.youtube.com';

    const popupEventNodename = isYoutubeMusic ? 'YTMUSIC-YOU-THERE-RENDERER' : 'YT-CONFIRM-DIALOG-RENDERER';

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let appObserver = null;
    const appName = isYoutubeMusic ? 'ytmusic-app' : 'ytd-app';
    const popupContainer = isYoutubeMusic ? 'ytmusic-popup-container' : 'ytd-popup-container';

    let pauseRequested = false;
    let pauseRequestedTimeout;
    const pauseRequestedTimeoutMillis = 5000;
    const idleTimeoutMillis = 5000;
    let lastInteractionTime = new Date().getTime();

    let videoElement = null;


    function asDoubleDigit(value) {
      return value < 10 ? '0' + value : value;
    }

    function getTimestamp() {
      let dt = new Date();
      let time = asDoubleDigit(dt.getHours()) + ':' + asDoubleDigit(dt.getMinutes()) + ':' + asDoubleDigit(dt.getSeconds());
      return time;
    }

    function isIdle() {
      return getIdleTime() >= idleTimeoutMillis;
    }

    function getIdleTime() {
      return new Date().getTime() - lastInteractionTime;
    }

    function listenForMediaKeys() {
      if (navigator.mediaSession === undefined) {
        return;
      }
      navigator.mediaSession.setActionHandler('pause', () => {
        pauseVideo();
      });
      navigator.mediaSession.yns_setActionHandler = navigator.mediaSession.setActionHandler;
      navigator.mediaSession.setActionHandler = (action, fn) => {
        if (action === 'pause') {
          return;
        }
        navigator.mediaSession.yns_setActionHandler(action, fn);
      };
    }

    function listenForMouse() {
      const eventName = window.PointerEvent ? 'pointer' : 'mouse';
      document.addEventListener(eventName + 'down', (e) => {
        processInteraction(eventName + 'down');
      });

      document.addEventListener(eventName + 'up', (e) => {
        processInteraction(eventName + 'up');
      });
    }

    function listenForKeyboard() {
      document.addEventListener('keydown', (e) => {
        processInteraction('keydown');
      });

      document.addEventListener('keyup', (e) => {
        processInteraction('keyup');
      });
    }

    function processInteraction(action) {
      if (pauseRequested) {
        pauseVideo();
        return;
      }
      lastInteractionTime = new Date().getTime();
    }

    function observeApp() {
      appObserver = new MutationObserver((mutations, observer) => {
        overrideVideoPause();
      });

      appObserver.observe(document.querySelector(appName), {
        childList: true,
        subtree: true
      });
    }

    function listenForPopupEvent() {
      document.addEventListener('yt-popup-opened', (e) => {
        if (isIdle() && e.detail.nodeName === popupEventNodename) {
        
          document.querySelector(popupContainer).handleClosePopupAction_();
          pauseVideo();
          videoElement.play();
        }
      });
    }

    function overrideVideoPause() {
      if (videoElement?.yns_pause !== undefined) return;
      if (document.querySelector('video') === null) return;

      videoElement = document.querySelector('video');
      listenForMediaKeys();
      videoElement.yns_pause = videoElement.pause;
      videoElement.pause = () => {
        if (!isIdle()) {
          pauseVideo();
          return;
        }
        pauseRequested = true;
        setPauseRequestedTimeout();
      };
    }

    function setPauseRequestedTimeout(justClear = false) {
      clearTimeout(pauseRequestedTimeout);
      if (justClear) return;
      pauseRequestedTimeout = setTimeout(() => {
        pauseRequested = false;
      }, pauseRequestedTimeoutMillis);
    }

    function pauseVideo() {
      videoElement?.yns_pause();
      pauseRequested = false;
      setPauseRequestedTimeout(true);
    }

    listenForMouse();
    listenForKeyboard();

    listenForPopupEvent();
    observeApp();

  } +
  ')();';
try{
	var script = document.createElement('script');
	script.textContent = Injection;
	(document.head || document.documentElement).appendChild(script);
	script.remove();
}catch{}