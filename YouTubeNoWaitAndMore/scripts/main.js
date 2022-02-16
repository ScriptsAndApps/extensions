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
