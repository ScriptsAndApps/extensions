'use strict';

var hasInjected = false;
var hasListener = false;
var injectedage = false;
var doFullscreen = false;
var doFullscreenenabed = false;
var isnstantplayactive = false;
var thisappisdiasables = false;

var intervalonvde = 0;
var intervalcntp = 0;
var intervalrandom = 0;
var intervalskipp = 0;

intervalrandom = setInterval(randomizerloop, 2000);
intervalskipp = setInterval(skippopup, 2000);

_handle = _handle.bind(document);
chrome.runtime.onMessage.addListener(_handle);


var enabledinstanew = false;
var enabledskip = false;
var enabledageres  = false;

function _handle({ action, payload }) {
    if (action === "CHANGE_SETTINGS") {
	//"autoplay", "instantnew","autofullscreennew","instantskip","ageres","appenabled"
	console.log('changed setting - 0');
	if(payload.key!="appenabled"){
		if(thisappisdiasables)return;
		console.log('changed setting - 1');
	}
	console.log('changed setting - 2');
		switch(payload.key){
			case "instantnew":
			 if(payload.enabled){
				 if(!hasListener){
					attatchVideoListener();
				 }
				 enabledinstanew = true;
				 isnstantplayactive=true;
					console.log('Activated onvideoend() loop');
					clearInterval(intervalonvde);
					intervalonvde = setInterval(onvideoend, 1000);
				}else{
					enabledinstanew=false
					isnstantplayactive=false;
					clearInterval(intervalonvde);
				}
			break;
			case "instantskip":
			 if(payload.enabled){
				 enabledskip=true;
					console.log('Activated cantPlay() loop');
					clearInterval(intervalcntp);
					intervalcntp = setInterval(cantPlay, 2000);
				}else{
					enabledskip=false;
					clearInterval(intervalcntp);
				}
			break;
			case "ageres":
			 if(payload.enabled){
				 enabledageres=true;
				if(!injectedage)
				{   injectedage = true;
					location.pathname.indexOf('/embed/') === 0;
					function createElement(tagName, options) {
						const node = document.createElement(tagName);
						options && Object.assign(node, options);
						return node;
					}
					function injectScript() {
						const nScript = createElement('script', { src: chrome.runtime.getURL('autoProxy.js') });
						document.documentElement.append(nScript);
						nScript.remove();
					}
					injectScript();
					
					console.log('injected age script');
					
				}
			}else{
				enabledageres=false;
			}
			break;
				case "autofullscreennew":
				
			 if(payload.enabled){
				doFullscreenenabed = true;
				doFullscreen = true;
				console.log('started not existing autofullscreen');
			}else{
				 doFullscreenenabed = false;
				 doFullscreen =false;
			}
			
			break;
			
			case "appenabled":
			 if(!payload.enabled){
				 console.log('re-anable app');
					intervalrandom = setInterval(randomizerloop, 2000);
					intervalskipp = setInterval(skippopup, 2000);
					thisappisdiasables = false;
					

				if (enabledinstanew){
					
					 if(!hasListener){
						attatchVideoListener();
					 }
					 enabledinstanew = true;
					 isnstantplayactive=true;
						console.log('Activated onvideoend() loop');
						clearInterval(intervalonvde);
						intervalonvde = setInterval(onvideoend, 1000);
					
				}
				if (enabledskip){
							 enabledskip=true;
					console.log('Activated cantPlay() loop');
					clearInterval(intervalcntp);
					intervalcntp = setInterval(cantPlay, 2000);
				}
				if (enabledageres){
					 enabledageres=true;
				if(!injectedage)
				{   injectedage = true;
					location.pathname.indexOf('/embed/') === 0;
					function createElement(tagName, options) {
						const node = document.createElement(tagName);
						options && Object.assign(node, options);
						return node;
					}
					function injectScript() {
						const nScript = createElement('script', { src: chrome.runtime.getURL('autoProxy.js') });
						document.documentElement.append(nScript);
						nScript.remove();
					}
					injectScript();
					
					console.log('injected age script');
					
				}
				}

				if(!hasInjected){
					console.log('injected()');
					var script = document.createElement('script');
					script.textContent = Injection;
					(document.head || document.documentElement).appendChild(script);
					script.remove();
					hasInjected=true;
				}
				
					
				}else{
					 console.log('stopping app');
					 clearInterval(intervalskipp);
					 clearInterval(intervalrandom);
					 thisappisdiasables = true;
					 
					 isnstantplayactive=false;
					 clearInterval(intervalonvde);
					 clearInterval(intervalcntp);
				}		
			break;
		}
	}
}
setTimeout(()=>{
	chrome.runtime.sendMessage({action: "PAGE_READY"},
	  ({ yt, settings }) => {
	
		if (!yt) {
		  return;
		}
		if (!/youtube\.com/.test(window.location.origin)) {
		  return;
		}
		//"autoplay", "instantnew","autofullscreennew","instantskip","ageres","appenabled"
		
		if(settings.appenabled){
			thisappisdiasables = true;
			return;
		}else{
			thisappisdiasables = false;
				if(!hasInjected){
						console.log('injected()');
					var script = document.createElement('script');
					script.textContent = Injection;
					(document.head || document.documentElement).appendChild(script);
					script.remove();
					hasInjected=true;
				}
			
		}
		
		if(settings.autoplay){
			
			console.log('Activated autostart()');
			clearTimeout(autoStart);
			setTimeout(autoStart, 3000);
		}else{
			clearTimeout(autoStart);
		}

		if(settings.instantnew){
			enabledinstanew = true;
		    if(!hasListener){
				attatchVideoListener();
			 }
			 isnstantplayactive=true;
				console.log('Activated onvideoend() loop');
			 clearInterval(intervalonvde);
			intervalonvde = setInterval(onvideoend, 1000);
		}else{
			 isnstantplayactive=false;
			 clearInterval(intervalonvde);
		}
        if(settings.instantskip){
			enabledskip=true;
				console.log('Activated cantPlay() loop');
			 clearInterval(intervalcntp);
			intervalcntp = setInterval(cantPlay, 2000);
		}else{
			 clearInterval(intervalcntp);
		}

		if(settings.autofullscreennew){
			 doFullscreenenabed = true;
			 doFullscreen = true;
				console.log('started not existing autofullscreen');
		}else{
			 doFullscreenenabed = false;
			 doFullscreen =false;
		}
		
		if(settings.ageres){
			enabledageres = true;
			if(!injectedage)
			{   injectedage = true;
				location.pathname.indexOf('/embed/') === 0;
				function createElement(tagName, options) {
					const node = document.createElement(tagName);
					options && Object.assign(node, options);
					return node;
				}
				function injectScript() {
					const nScript = createElement('script', { src: chrome.runtime.getURL('autoProxy.js') });
					document.documentElement.append(nScript);
					nScript.remove();
				}
				injectScript();
				console.log('injected age script');
			}
		}else{

		}
	});
}, 100);

function autoStart(){
	
	console.log('----------Activated autoStart()');
		try{
			if(!doFullscreen)return;
			//alert("autoplay");
		    let current = document.querySelector('span.ytp-time-current').textContent;
			if (current == "0:00") {
			//start video this needs autoplay=true?
			document.querySelector('video').autoplay = false;
			document.querySelector('video').muted = true;
			if(document.querySelector('video').paused)
				document.querySelector('video').play();
			document.querySelector('video').muted = false;
			
			//hack
			setTimeout(()=>{
				if(document.querySelector('video').paused)
					document.querySelector('video').play();
			}, 300);
			setTimeout(()=>{
				if(document.querySelector('video').paused)
					document.querySelector('video').play();
			}, 1000);
			setTimeout(()=>{
				if(document.querySelector('video').paused)
					document.querySelector('video').play();
				if(doFullscreen){
					try{
						//to-do
					}catch{}
				}
			}, 2000);
			}
		}catch{}
}


function attatchVideoListener(){
	console.log('---------Activated attatchVideoListener()');
	try{
		let video = document.querySelector('video');
		
		if(video!=null){
			hasListener=true;
			video.addEventListener('ended', (event) => {
				
				if(!doFullscreen&&((window.fullScreen) ||(window.innerWidth == screen.width && window.innerHeight == screen.height)))return;
				
				if(isnstantplayactive){
				console.log('Video stopped either because 1) it was over, or 2) no further data is available.');
				 try{
					let d =document.querySelector(".ytp-autonav-endscreen-upnext-play-button");
					if(d!=null&&d.href!=""){
							console.log('Video is ended');
							window.location.assign(document.querySelector(".ytp-autonav-endscreen-upnext-play-button").href);		
					}
				}catch{}
				}
			});
		}else{
			if(isnstantplayactive){
				setTimeout(attatchVideoListener, 200);
				console.log('setTimeout(attatchVideoListener, 200);');
			}
		}
	}catch(e){
		if(isnstantplayactive){
			console.log('e');
			console.log('setTimeout(attatchVideoListener, 2000);'); 
			setTimeout(attatchVideoListener, 2000);
		} 
	
	}
	
}


function randomizerloop(){
	try{
		if(
		((window.location+"").includes("random-ize.com"))!=false){
		var er = document.querySelector('.embed-container');
			if(er!=null){
				window.location=er.children[0].src.replace("/embed/","/watch?v=");
			}
		}
	}catch{}
}
function cantPlay(){

				if(!doFullscreen&&((window.fullScreen) ||(window.innerWidth == screen.width && window.innerHeight == screen.height)))return;
				
	 try{
		var error = document.querySelector('.ytp-error-content-wrap-reason');
		if(error!=null){
			if(error.innerText=="Your browser can't play this video.\nLearn more")
			{
				window.location.assign(document.querySelector('.style-scope ytd-watch-next-secondary-results-renderer').querySelector('.details').querySelector('a').href);
			}
		}
	 }catch{}

	 try{
		var error = document.querySelector('.style-scope yt-player-error-message-renderer');
		if(error!=null){
			if(error.innerHTML.includes("Sign in to confirm your age")
				||error.innerHTML.includes("The uploader has not made this video available in your country"))
			{
				setTimeout(gotoRandomVideo,500);
			}
		}
	 }catch{}
}
function gotoRandomVideo(){
			try{
				if(document.querySelector('.style-scope ytd-watch-next-secondary-results-renderer')!=null){
						window.location.assign(document.querySelector('.style-scope ytd-watch-next-secondary-results-renderer').querySelector('.details').querySelector('a').href);
				}else{
						window.location.assign("https://random-ize.com/random-youtube/");
				}
					}catch{
						
						window.location.assign("https://random-ize.com/random-youtube/");
						
					}
}

function onvideoend(){
	try{
		if(!doFullscreen&&((window.fullScreen) ||(window.innerWidth == screen.width && window.innerHeight == screen.height)))return;
				
		let d =document.querySelector(".ytp-autonav-endscreen-upnext-play-button");
		
		let current = document.querySelector('span.ytp-time-current').textContent;
			let duration = document.querySelector('span.ytp-time-duration').textContent;
			//console.log(current +"-"+ duration+"=="+(current == duration));
		if(d!=null&&d.href!=""){
			
			
			//console.log('try video is ended new location');
			if (current == duration) {
				console.log('Video is ended');
			    window.location.assign(document.querySelector(".ytp-autonav-endscreen-upnext-play-button").href);
			}
		
		}
	}catch{}
	
}
	
	
	

function skippopup(){	
	
	try{
    let popup = document.getElementById('confirm-button');
    if(popup != null){
		let parent = popup.parentNode.parentNode.parentNode.parentNode;
    
		if (popup != null && getComputedStyle(parent).display != "none"){
			popup.click();
		}
	}
	}catch{}
}
	

var Injection =
  '(' +
  function () {
   const tag = '[Youtube NoStop]';
   console.log('script nostop');

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
