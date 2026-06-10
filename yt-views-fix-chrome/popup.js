/**
 * YT Views Fix — popup.js v1.0.4
 */

var STORE_URL_FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/yt-views-fix/';
var STORE_URL_CHROME  = 'https://chromewebstore.google.com/detail/yt-views-fix/';

// Set rate button URL based on browser
var rateBtn = document.getElementById('rateBtn');
if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
  rateBtn.href = STORE_URL_CHROME;
} else {
  rateBtn.href = STORE_URL_FIREFOX;
}
