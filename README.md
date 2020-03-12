# zenhub-colouring-chrome-plugin

## Why use the plugin
This plugin helps to visualise multiple issues from different repositories and give them a colour coding of your choosing to make it easy to understand at a glance different threads of work.

Typically, you have a number of github repos with issues and labels to represent different categories of work, different severities or priorities or other characteristics. You might already use Zenhub (https://www.zenhub.com/) for project management and have built a board.

You can use this plugin to add colour coding based on your labels.
For example, a severity 1 issue might appear as red, a story as green, a chore as yellow.


Here is a sample output with some made up issues in a test repo and real issues from this repo.
![Sample dashboard](https://github.com/doinaklinger/agile-colours/blob/master/images/sampleDashboard.png)

## Install

Choose the URL for which you want the plugin extension by clicking [here](https://github.com/doinaklinger/agile-colours/blob/master/manifest.json#L15).

Go [here]( https://github.com/doinaklinger/agile-colours/blob/master/content.js#L1) and customise your colour coding.

Ready to run it?
Go to chrome://extensions/ and enable developer mode (toggle on the right hand side).


Click on the **Load unpacked** and select this repo. The new extension

## Provenance
This has been developed starting from this sample https://developer.chrome.com/extensions/getstarted
The plugin is distributed under Apache licence.
