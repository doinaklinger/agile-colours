# zenhub-colouring-chrome-plugin
Browser extension for adding colours to [Zenhub](https://www.zenhub.com/) boards.
Created by team Supro to improve our process for delivering [IBM App Connect Product](https://www.ibm.com/uk-en/cloud/app-connect).
This has been developed starting from this sample https://developer.chrome.com/extensions/getstarted

Authors: [Chengxuan Xing](https://github.com/Chengxuan) , [Doina Klinger](https://github.com/doinaklinger) , [Tom Soal](https://github.com/tomsoal)

## Customise before installation
1. Clone this repo, or download it.
1. The plugin works for IBM github repos by default, to make it work for public github or your own private repo. Do a search using string `github.ibm.com` and replace it with your preferred domain.
1. The plugin has default colouring rules which is specified in [contents.js](./content.js), you can extend the JSON object to have your own rules. The existing rules supports colours for a Zenhub card(issue) with specific labels or the issue is from a repo of which name contains specific keywords.

## Install - Beta
1. Go to chrome://extensions/ and enable developer mode (toggle on the right hand side).
1. Click on the **Load unpacked** and select this repo. The new extension
**Zenhub Colouring** should be available.

## Use
1. Navigate to your [Zenhub](https://www.zenhub.com/) board, the extension icon should be enabled, the Zenhub issues should get coloured by default.
1. You can hide the side toolbar by clicking on the extension and toggle on `Hide Sidebar`. As soon as you move your cursor over one of the Zenhub issues, the sidebar will disappear.

