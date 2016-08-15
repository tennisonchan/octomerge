'use strict';

function save_options() {
  var accessToken = document.getElementById('accessToken').value;
  chrome.storage.sync.set({
    accessToken: accessToken
  }, function() {
    window.close();
  });
}

function restore_options() {

  chrome.storage.sync.get({
    accessToken: null
  }, function(items) {
    document.getElementById('accessToken').focus();
    document.getElementById('accessToken').value = items.accessToken;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
