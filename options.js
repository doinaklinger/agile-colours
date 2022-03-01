// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


let profileInput, profileTextArea, profileSelect
let downloadButton, applyButton

const builtInProfiles = [{
  "name": "zenhub",
  "queryType": "className",
  "queryText": "zh-app__workspace",
  "colour": {
    "widgets": [{
      "queryType": "className",
      "queryText": "zhc-issue-card",
      "rules": [{
        "colour": "lightgreen",
        "textMatchers": [{
          "queryType": "className",
          "queryText": "zhc-issue-card__repo-name",
          "endsWith": ['-planning', '-stories']
        }, {
          "queryType": "className",
          "queryText": "zhc-issue-card__meta__badges",
          "children": {
            "queryType": "tagName",
            "queryText": "span",
            "equal": ['story', 'epic']
          }
        }]
      }, {
        "colour": "pink",
        "textMatchers": [{
          "queryType": "className",
          "queryText": "zhc-issue-card__repo-name",
          "endsWith": ['-support', '-incidents', '-test', '-tickets']
        }, {
          "queryType": "className",
          "queryText": "zhc-issue-card__meta__badges",
          "children": {
            "queryType": "tagName",
            "queryText": "span",
            "equal": ['production issue', 'pipeline break', 'critical', 'build break']
          }
        }]
      }, {
        "colour": "lightyellow",
        "textMatchers": [{
          "queryType": "className",
          "queryText": "zhc-issue-card__repo-name",
          "endsWith": ['-debt', '-chore', '-usability']
        }, {
          "queryType": "className",
          "queryText": "zhc-issue-card__meta__badges",
          "children": {
            "queryType": "tagName",
            "queryText": "span",
            "equal": ['chore', 'enhancement', 'usability', 'bug']
          }
        }]
      }, {
        "colour": "lightblue",
        "textMatchers": [{
          "queryType": "className",
          "queryText": "zhc-issue-card__repo-name",
          "endsWith": ['-rca-tasks', '-rca']
        }, {
          "queryType": "className",
          "queryText": "zhc-issue-card__meta__badges",
          "children": {
            "queryType": "tagName",
            "queryText": "span",
            "equal": ['rca-improvement', 'rca']
          }
        }]
      }]
    }]
  },
  "hide": {
    "widgets": [{
      "queryType": "className",
      "queryText": "zhc-sidebar",
      "stylePropertiesOverrides": {"width": "0", "visibility": "hidden"}
    }, {
      "queryType": "className",
      "queryText": "zhc-board__menu",
      "stylePropertiesOverrides": {"height": "0", "visibility": "hidden"}
    }]
  }
}]

function updateTextArea(profileName, profileObject) {
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

function handleFileChange(event) {
  const reader = new FileReader()
  reader.onload = () => {
    const profileObject = JSON.parse(reader.result)
    profileSelect.value = "custom"
    updateTextArea('custom', profileObject)
  }
  reader.readAsText(event.target.files[0])
}

function handleSelectChange(event) {
  const profileObject = builtInProfiles.find(p => p.name === event.target.value)
  updateTextArea(event.target.value, profileObject)
}

function handleDownload() {
  var tmpElement = document.createElement('a')
  tmpElement.style.display = 'none'
  tmpElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(profileTextArea.value))
  tmpElement.setAttribute('download', 'zc-profile.json')
  document.body.appendChild(tmpElement)
  tmpElement.click()
  document.body.removeChild(tmpElement)
}

function handleApply() {
  chrome.storage.sync.set({ profile: JSON.parse(profileTextArea.value) });
}

document.addEventListener('DOMContentLoaded', function () {
  profileInput = document.getElementById('input-profile')
  profileTextArea = document.getElementById('ta-profile')
  profileSelect = document.getElementById('select-profile')
  downloadButton = document.getElementById('btn-download')
  applyButton = document.getElementById('btn-apply')

  chrome.storage.sync.get('profile', function (data) {
    profileSelect.value = data.profile.name
    updateTextArea(data.profile.name, data.profile)
    profileSelect.addEventListener('change', handleSelectChange)
    profileInput.addEventListener('change', handleFileChange);
    downloadButton.addEventListener('click', handleDownload)
    applyButton.addEventListener('click', handleApply)
  });
});