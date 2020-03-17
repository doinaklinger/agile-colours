// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    toggles: {
      applycolour: true,
      hideoptions: false
    },
    profile: {
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

    }
  });
});
