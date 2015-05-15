var phantom = require('phantom');
var fs = require('fs');
var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var sys = require('sys');

// comment
phantom.create(function (ph) {

  ph.createPage(function (page) {
    page.open("http://us.battle.net/heroes/en/heroes/", function (status) {
      console.log("opened hots? ", status);
      page.evaluate(function () { return document.documentElement.innerHTML; }, function (result) {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.log("Error: " + err);
            } else {

                var heroes = select(dom, '.hero-list__item a');

                heroes.forEach(function(hero) {
					console.log('Name: ' + hero.attribs['data-action']);
					console.log('Slug: ' + hero.attribs['href']);
                })
            }
        });

		var parser = new htmlparser.Parser(handler);
		parser.parseComplete(result);

        ph.exit();
      });
    });
  });
  
}, {
  dnodeOpts: {
    weak: false
  }
});