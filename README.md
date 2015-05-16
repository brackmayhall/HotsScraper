# HotsScraper ![alt tag](https://raw.github.com/brackmayhall/HotsScraper/master/claw.png  =100x20)

Node service for scraping Heroes of the Storm Data from battleNet.

Stores heroes locally and watches for changes.

If a change occurs you can use the syncRemoteDatabase function to update a remote database(you will need to make this connection)

run npm install and package.json file will install required node packages.

## Required packages
* phantomjs, install this globally(-g) and set PATH to its bin folder
* phantom
* soupselect
* htmlparser
* nedb

## Todo
* add better hooks for remote sync
* better error checking
* add a sleep mechanism so not constantly hammering battleNet
* fix for OSX
