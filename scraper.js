var phantom = require('phantom');
var fs = require('fs');
var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var sys = require('sys');




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
                    //console.log('data-action '+hero.attribs['data-action']);
                    console.log('href '+hero.attribs['href']);
                    console.log('children '+hero.children[3].children[0].raw);
                    console.log('');
                    /*
                    var object = hero.children[3];
                    var output = '';
                    for (var property in object) {
                      output += property + ': ' + object[property]+'; ';
                    }
                    console.log(output);
                    */
                    //var tempHero = {name:hero.attribs['data-action'], slug:hero.attribs['href']};
                    //heroesArr.push(tempHero);
                  });
                  page.close();
                  console.log('scraped all heroes');
                  //getHeroes(ph,heroesArr,scrapedAllHeroes);
              }
          });

          var parser = new htmlparser.Parser(handler);
          parser.parseComplete(result);

          //ph.exit();
        });
      });
    });




    
  }, {
    dnodeOpts: {
      weak: false
    }
  });






function getHeroes(ph,heroes,callback) {
  /*
  heroes.forEach(function(hero) {
    console.log('inside heroes: ' + hero.name +' : '+ hero.slug);
    // http://us.battle.net/heroes/en/heroes/+ 
  });
  callback('got all heroes');
  ph.exit();
  */
  
    ph.createPage(function (page,test) {

    page.open('http://us.battle.net/heroes/en/heroes/'+heroes[0].slug, function (status) {
      console.log("opened hots? ", status);
      page.evaluate(function () { return document.documentElement.innerHTML; }, function (result) {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.log("Error: " + err);
            } else {

                var altName = select(dom, '.hero-identity__title paragraph__heading--alternate ng-binding');
                console.log(dom);
                page.close();
/*
                heroes.forEach(function(hero) {
                  console.log('name2: ' + hero.attribs['data-action']);
                  console.log('slug2: ' + hero.attribs['href']);
                })
*/
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(result);

        ph.exit();
      });
    });
  });
    
}


// callback
function scrapedAllHeroes(msg) {
    // I'm the callback
    console.log(msg);
}