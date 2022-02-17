
domReady(() => {
  initUrlButtons();
  translateHTML();
  bindCheckboxes();

})

function domReady (callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback, false);
  }
}

function translateHTML (dataKey = 'message') {
	/*add content from manifest*/
	document.querySelector('.extension_name').innerText = `${chrome.runtime.getManifest().name}`;
	//locales url-1
	//locales url-2
}

function bindCheckboxes() {
  for (const $setting of document.querySelectorAll('.settings')) {
 
	const $input = $setting.querySelector('input');
    $input.checked = $input.name == "ageres" ? localStorage[$input.name] === 'true' : localStorage[$input.name] !== 'false' ;
    $setting.addEventListener('change', (event) => {
      localStorage[$input.name] = $input.checked;
    }, false);
  }
}

function initUrlButtons() {
	/*to add content from extension's data*/
	document.querySelector('.url1').href = `https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/`;
	document.querySelector('.url2').href = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews`;

 
}
