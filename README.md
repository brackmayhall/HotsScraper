![alt tag](https://raw.github.com/brackmayhall/HotsScraper/master/images/claw.png) # HotsScraper 


Node service for scraping Heroes of the Storm Data from battleNet.

Stores heroes locally and watches for changes.

If a change occurs you can use the syncRemoteDatabase function to update a remote database(you will need to make this connection)

run npm install and package.json file will install required node packages.

if on mac install phantom and set path using the following tutorial
http://blog.just2us.com/2011/05/setting-path-variable-in-mac-permanently/
then run the mac version "node macScraper.js"

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
