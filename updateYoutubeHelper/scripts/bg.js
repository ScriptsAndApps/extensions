'use strict';

var manifest = chrome.runtime.getManifest();

const settings = {
	  autoplay: localStorage.autoplay !== "false",
	  autofullscreennew: localStorage.autofullscreennew !== "false",
	  instantnew: localStorage.instantnew !== "false",
	  instantskip: localStorage.instantskip !== "false",
	  ageres: localStorage.ageres === "true"
};
	
const getStorage = async () => {
	 const tabTracker = new Set();
	  const YT_REGEX = /^https?:\/\/(\w*.)?youtube.com/i;
	  window.addEventListener("storage", ({ key, newValue }) => {
	  if (["autoplay", "instantnew","autofullscreennew","instantskip","ageres"].includes(key)) {
		settings[key] = newValue === "true";
	  }

      for (const tabId of tabTracker) {
        chrome.tabs.sendMessage(tabId, {
          action: "CHANGE_SETTINGS",
          payload: {
			key: key,
            enabled: newValue === "true",
          },
        });
      }
	  
  });
  
    chrome.webRequest.onBeforeRequest.addListener(
    ({ tabId, url }) => {
      if (YT_REGEX.test(url)) {
        tabTracker.add(tabId);
      } else {
        tabTracker.delete(tabId);
      }
    },
    {
      urls: ["http://*/*", "https://*/*"],
      types: ["main_frame"],
    }
	);
  
	chrome.runtime.onMessage.addListener(({ action, href, message }, { tab }, sendResponse) => {
		if (action === "PAGE_READY") {
		  sendResponse({ yt: tabTracker.has(tab.id), settings });
		}
	});
  
}
getStorage();

const notify = message => chrome.notifications.create(null, {
  type: 'basic',
  iconUrl: '/images/yt.png', //48px icon to show with message
  title: manifest.name,
  message
});

const ports = [];
chrome.runtime.onConnect.addListener(port => {
  const index = ports.push(port) - 1;
  port.onDisconnect.addListener(() => {
    ports.splice(index, 1);
  });
});

const find = () => new Promise((resolve, reject) => {
  if (ports.length) {
    return resolve(ports[0].sender.tab);
  }
  reject(Error('no window'));
});

//create function 
const onCommand = (options = {}) => find().then(tab => {
	chrome.windows.update(tab.windowId, {
	focused: true
	});
	chrome.tabs.update(tab.id, {
	highlighted: true
	});
	return tab;
}).catch(() => new Promise(resolve => chrome.storage.local.get({
	  'width': 1100,
	  'height': 600,
	  'left': screen.availLeft + Math.round((screen.availWidth - 1100) / 2),
	  'top': screen.availTop + Math.round((screen.availHeight - 600) / 2),
	  'open-in-tab': false
	}, prefs => {
		const args = new URLSearchParams();
		if (options.src) {
		  if(imglist.some(v =>  options.src.toLowerCase().endsWith('.'+v))){
		  }
			  
		  try{
				args.set('src', btoa(options.src));
				
		  } catch{
			   args.set('src', options.src);
		  }
		}
		args.set('mode', prefs['open-in-tab'] ? 'tab' : 'window');

		const url = 'data/page.html?' + args.toString();

		if (prefs['open-in-tab']) {
			chrome.tabs.create({
			  url
			}, resolve);
			}
		else {
			delete prefs['open-in-tab'];
			chrome.windows.create(Object.assign(prefs, {
			  url,
			  type: 'popup'
			}), w => resolve(w.tabs[0]));
		}
	})));
	
	/*
window.save = prefs => {
  chrome.storage.local.set(prefs);
};
	
chrome.browserAction.onClicked.addListener(() => {
  const next = () => chrome.tabs.executeScript({
    runAt: 'document_start',
    allFrames: true,
    matchAboutBlank: true,
    code: `[...document.querySelectorAll('video, audio, source')].map(e => {
      if (e.src && e.src.startsWith('http')) {
        try {
          e.pause();
        }
        catch (e) {}
        return e.src;
      }
    })`
  }, results => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      onCommand();
    }
    else {
      results = results.flat().filter(a => a);
      if (results.length) {
        onCommand({
          src: results[0]
        }).then(t => chrome.tabs.sendMessage(t.id, {
          method: 'open-src',
          src: results[0]
        }));
      }
      else {
        onCommand();
      }
    }
  });
  chrome.storage.local.get({
    'request-active-tab': true
  }, prefs => {
    if (prefs['request-active-tab']) {
          notify(`Disabled in-page icons`);
         thissheet  = false;     
	 chrome.storage.local.set({
        'request-active-tab': false
      });
      
    }
    else {
		   notify(`Enabled in-page icons`);
		 thissheet  = true;
      chrome.storage.local.set({
        'request-active-tab': true
      });
    }
  });
});
*/


/*
(callback => {
  chrome.runtime.onInstalled.addListener(callback);
  chrome.runtime.onStartup.addListener(callback);
})(() => {
  
  chrome.contextMenus.create({ //onClick get src of element
    id: 'open-src',
    title: 'Do something',
    contexts: ['video', 'audio'],
    documentUrlPatterns: ['*://*------/*'],
    targetUrlPatterns: ['*://*-----/*']
  });
  chrome.contextMenus.create({
    title: 'Do somethings url',
    id: 'play-link',
    contexts: ['link'],
    targetUrlPatterns: [
      'avi', 'mp4', 'webm', 'flv', 'mov', 'ogv', '3gp', 'mpg', 'wmv', 'swf', 'mkv', 'vob',
      'pcm', 'wav', 'aac', 'ogg', 'wma', 'flac', 'mid', 'mka', 'm4a', 'voc', 'm3u8','avi',
	'png','jpeg','jpg','img','svg','webp','apng','avif','bmp','ico','tiff','gif'
    ].map(a => '*://*-----/*.' + a),
    documentUrlPatterns: ['*://*-----------/*']
  });
  chrome.contextMenus.create({
    id: 'previous-track',
    title: 'Previous track',
    contexts: ['browser_action'] //??
  });
  chrome.contextMenus.create({
    id: 'next-track',
    title: 'Next track',
    contexts: ['browser_action'] //??
  });
  chrome.contextMenus.create({
    id: 'toggle-play',
    title: 'Toggle play/pause',
    contexts: ['browser_action'] //??
  });
  chrome.contextMenus.create({
    id: 'test-audio',
    title: 'Test Playback',
    contexts: ['browser_action'] //??
  });
  chrome.storage.local.get({
    'open-in-tab': false
  }, prefs => {
    chrome.contextMenus.create({
      id: 'open-in-tab',
      title: 'Open Player in Tab',
      contexts: ['browser_action'], //??
      type: 'checkbox',
      checked: prefs['open-in-tab'] //get settings and show context menu with settings ==> onClicked info.*
    });
  });
  
});
*/


/*
chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === 'open-in-tab') {
    chrome.storage.local.set({
      'open-in-tab': info.checked //if clicked set settings to new setting
    });
  }
  else if (info.menuItemId === 'test-audio') {
    chrome.tabs.create({
      url: 'https://webbrowsertools.com/audio-test/'
    });
  }
  else if (info.menuItemId === 'open-src') {
    onCommand({
      src: info.srcUrl
    }).then(t => chrome.tabs.sendMessage(t.id, { //get src of element exist then..
      method: 'open-src',
      src: info.srcUrl
    }));
  }
  else if (info.menuItemId === 'play-link') {
    onCommand({
      src: info.linkUrl
    }).then(t => chrome.tabs.sendMessage(t.id, {
      method: 'open-src',
      src: info.linkUrl
    }));
  }
  else {
    find().then(t => chrome.tabs.sendMessage(t.id, {
      method: info.menuItemId
    })).catch(() => notify('Please open "Something" and retry'));
  }
});

*/