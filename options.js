// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


let profileInput, profileTextArea, profileSelect
let downloadButton, applyButton

const builtInProfiles = [{
    "name": "zenhub",
    "className": "zh-app__workspace",
    "colour": {
      "widgets": [{
        "className": "zhc-issue-card",
        "rules": [{
          "colour": "lightgreen",
          "textMatchers": [{
            "className": "zhc-issue-card__repo-name",
            "endsWith": ['-planning', '-stories']
          }, {
            "className": "zhc-label",
            "equal": ['story', 'green', 'epic']
          }]
        }, {
          "colour": "pink",
          "textMatchers": [{
            "className": "zhc-issue-card__repo-name",
            "endsWith": ['-support', '-incidents', '-test', '-tickets']
          }, {
            "className": "zhc-label",
            "equal": ['production issue', 'pipeline break', 'critical', 'build break', 'pink']
          }]
        }, {
          "colour": "lightyellow",
          "textMatchers": [{
            "className": "zhc-issue-card__repo-name",
            "endsWith": ['-debt', '-chore', '-usability']
          }, {
            "className": "zhc-label",
            "equal": ['chore', 'enhancement', 'usability', 'bug', 'yellow']
          }]
        }, {
          "colour": "lightblue",
          "textMatchers": [{
            "className": "zhc-issue-card__repo-name",
            "endsWith": ['-rca-tasks', '-rca']
          }, {
            "className": "zhc-label",
            "equal": ['rca-improvement', 'rca', 'blue']
          }]
        }]
      }]
    },
    "hide": {
      "widgets": [{
        "className": "zhc-sidebar"
      }, {
        "className": "zhc-board__menu"
      }]
    }
  }]

function updateTextArea (profileName, profileObject) {
    if (!profileObject) {
        profileObject = JSON.parse(profileTextArea.value)
    }
    if (builtInProfiles.find(p => p.name === profileName)) {
        profileTextArea.setAttribute("readonly", true)
    } else {
        profileTextArea.removeAttribute("readonly")
        profileObject.name = "custom"
    }
    profileTextArea.value = JSON.stringify(profileObject, null, 2)
}

function handleFileChange (event) {
    const reader = new FileReader()
    reader.onload = () => {
        const profileObject = JSON.parse(reader.result)
        profileSelect.value = "custom"
        updateTextArea('custom', profileObject)
    }
    reader.readAsText(event.target.files[0])
}

function handleSelectChange (event) {
    const profileObject = builtInProfiles.find(p => p.name === event.target.value)
    updateTextArea(event.target.value, profileObject)
}

function handleDownload () {
    var tmpElement = document.createElement('a')
    tmpElement.style.display = 'none'
    tmpElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(profileTextArea.value))
    tmpElement.setAttribute('download', 'zc-profile.json')
    document.body.appendChild(tmpElement)
    tmpElement.click()
    document.body.removeChild(tmpElement)
}

function handleApply () {
    chrome.storage.sync.set({profile: JSON.parse(profileTextArea.value)});
}

document.addEventListener('DOMContentLoaded', function () {
    profileInput = document.getElementById('input-profile')
    profileTextArea = document.getElementById('ta-profile')
    profileSelect = document.getElementById('select-profile')
    downloadButton = document.getElementById('btn-download')
    applyButton = document.getElementById('btn-apply')

    chrome.storage.sync.get('profile', function(data) {
        profileSelect.value = data.profile.name
        updateTextArea(data.profile.name, data.profile)
        profileSelect.addEventListener('change', handleSelectChange)
        profileInput.addEventListener('change', handleFileChange);
        downloadButton.addEventListener('click', handleDownload)
        applyButton.addEventListener('click', handleApply)
    });
});