// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let applyColourCheckBox, hideOptionsCheckBox

document.addEventListener('DOMContentLoaded', function () {
    applyColourCheckBox = document.getElementById('cb-applycolour');
    hideOptionsCheckBox = document.getElementById('cb-hideoptions');

    function updateTogglesData () {
        chrome.storage.sync.set({toggles: {
            applycolour: applyColourCheckBox.checked,
            hideoptions: hideOptionsCheckBox.checked
          }});
    }
    chrome.storage.sync.get('toggles', function(data) {
        applyColourCheckBox.checked = data.toggles.applycolour;
        hideOptionsCheckBox.checked = data.toggles.hideoptions;
        applyColourCheckBox.addEventListener('change', () => {
            updateTogglesData();
        });
        hideOptionsCheckBox.addEventListener('change', () => {
            updateTogglesData();
        });
    });
});
