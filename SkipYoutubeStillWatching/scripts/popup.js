
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
  document.querySelector('.extension_name').innerText = '$chrome.runtime.getManifest().name';
  //locales
 for (const $element of document.getElementsByTagName('*')) {
    if ($element.dataset && $element.dataset['message']) {
		let contents =  chrome.i18n.getMessage($element.dataset['message']);
		if(contents!=null && contents.length > 0 ){
			$element.innerHTML = contents;
		}
    }
  }
}

function toggleButtons(sett,thisbutton,notenabled){
	const $boxlabel = sett.querySelector('label');
	const $boxspan = $boxlabel.querySelector('span');
	if(!notenabled){
		$boxspan.setAttribute("style","color: #000;");
		$boxlabel.classList.value = "switch-label";
		$boxlabel.classList.value = "switch-label";
	}else{
		$boxspan.setAttribute("style","color: #ddd;");
		$boxlabel.classList.value = !thisbutton ?  "switch-label" : "switch-label-off";
	}
}

function bindCheckboxes() {
	for (const $setting of document.querySelectorAll('.settings')) {
		const $input = $setting.querySelector('input');
		$input.checked = $input.name == "ageres" ? localStorage[$input.name] === 'true' : localStorage[$input.name] !== 'false' ;
		const $boxlabel = $setting.querySelector('label');
		const $boxspan = $boxlabel.querySelector('span');
		
		toggleButtons($setting,$input.name!="appenabled",localStorage["appenabled"] === 'true');
		
		$setting.addEventListener('change', (event) => {
			localStorage[$input.name] = $input.checked;
			for (const $setting of document.querySelectorAll('.settings')) {
				const $input = $setting.querySelector('input');
				if( $input.name!="appenabled")
				{
					$input.disabled = document.querySelector('.settings .switch-input#appenabled').checked;
				}
				toggleButtons($setting,$input.name!="appenabled",document.querySelector('.settings .switch-input#appenabled').checked);
			}
		}, false);
	}
    for (const $setting of document.querySelectorAll('.settings')) {
		const $input = $setting.querySelector('input');
		if( $input.name!="appenabled")
		{
			 $input.disabled = document.querySelector('.settings .switch-input#appenabled').checked;
		}
	}
}

function initUrlButtons() {
	/*to add content from extension's data*/
	document.querySelector('.url1').href = `https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/`;
	document.querySelector('.url2').href = `https://chrome.google.com/webstore/detail/${chrome.runtime.id}/reviews`;

 
}
