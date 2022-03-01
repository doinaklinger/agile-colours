// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('profile', function (data) {
    if (!data.profile) {
      chrome.storage.sync.set({
        toggles: {
          applycolour: true,
          hideoptions: false
        },
        profile: {
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
        }
      });
    }
  });
});
