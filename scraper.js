var phantom = require('phantom');
var fs = require('fs');
var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var sys = require('sys');

// initial hero get
getHeroList();

// get all hero names and slugs
function getHeroList() {

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

                  var heroesArr = [];
                  heroes.forEach(function(hero) {
                    var tempHero = {name:hero.children[3].children[0].raw, slug:hero.attribs['href']};
                    heroesArr.push(tempHero);
                  });

                  page.close();
                  console.log('got all hero names and slugs');
                  getHeroes(ph,heroesArr,scrapedAllHeroes);
              }
          });

          var parser = new htmlparser.Parser(handler);
          parser.parseComplete(result);

        });
      });
    });

  }, {
    dnodeOpts: {
      weak: false
    }
  });

}



function getNextHero(ph,index,heroes){

    if(index >= heroes.length){
      // exit detailed async loop and start over
      scrapedAllHeroes(ph);
      return;
    }

    ph.createPage(function (page,test) {

      console.log(heroes[index].slug);

    page.open('http://us.battle.net/heroes/en/heroes/'+heroes[index].slug, function (status) {
      console.log("opened "+heroes[index].slug, status);
      page.evaluate(function () { return document.documentElement.innerHTML; }, function (result) {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.log("Error: " + err);
            } else {

                var tempHero = new Hero();
                console.log('got one');
                
                /*
                var main = select(dom, '.all-content-wrapper');
                var description = {};
                var skins = [];
                var stats = [];
                var type = [];
                var heroicAbilities = [];
                var primaryAbilities = [];
                var heroTrait = {};
                //console.log(main[0].children[3].children[1].children[2]);
                */

                // close the page and get the next hero
                page.close();
                getNextHero(ph,index+1,heroes);
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(result);

      });
    });
  });
}


// start getting detail hero information
function getHeroes(ph,heroes) {
  getNextHero(ph,0,heroes);    
}


// scraped all detailed hero info.
// exit ph and 
function scrapedAllHeroes(ph) {
    
    ph.exit();
    // now check all heroes again
    getHeroList();
}






/*
var object = hero.children[3];
var output = '';
for (var property in object) {
  output += property + ': ' + object[property]+'; ';
}
console.log(output);
*/






var Hero = function() {
    this.name = '';
    this.slug = '';
    this.skins = [];
    this.skills = [];
    this.type = '';
    this.heroicAbilities = [];
    this.primaryAbilities = [];
    this.trait = '';
    return this;
};