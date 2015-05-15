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

      page.evaluate(function () { return document.documentElement.innerHTML; }, function (result) {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.log("Error: " + err);
            } else {

                var tempHero = new Hero();

                
                var description = select(dom,'.hero-description');
                console.log(description[0].children[0].raw);

                var skinList = select(dom,'.skin-list li');
                skinList.forEach(function(skin) {
                    //printObjectinfo(skin);
                    var skinName = stripSkinName(skin.attribs['data-ng-click']);
                    var skinIcon =  'http://us.battle.net' + skin.children[0].attribs['src'];
                    console.log(skinName);
                    console.log(skinIcon);
                })
                
                var statList = select(dom,'.hero-stats li');
                statList.forEach(function(stat) {
                    var type = stat.children[1].raw;
                    console.log(stripStatName(type));
                    var statTypes = stat.children[3].children[3].raw;
                    console.log(stripStatNumber(statTypes));
                })
                

                var role = select(dom,'.hero-role');
                console.log(role[0].children[0].raw);
                
                
                var primAbilities = select(dom,'.abilities-container__wrapper .abilities-container__ability-box .ability-box__data');

                primAbilities.forEach(function(abil) {
                  var abilImageLink = 'http://us.battle.net' + abil.children[1].children[1].children[1].children[0].attribs['src'];
                  var abilIcon =      'http://us.battle.net' + abil.children[1].children[3].children[0].attribs['src'];
                  var abilName =      abil.children[3].children[1].children[0].raw;
                  var abilDesc =      abil.children[3].children[3].children[1].children[0].raw;;
                  console.log(abilImageLink);
                  console.log(abilIcon);
                  console.log(abilName);
                  console.log(abilDesc);
                })
                
                var trait = select(dom,'.trait-icon-container');
                var traiteIcon = 'http://us.battle.net' + trait[0].children[1].children[1].attribs['src'];
                var traiteName = trait[0].children[3].children[1].children[0].raw;
                var traiteDesc = trait[0].children[3].children[3].children[0].raw;
                console.log(traiteIcon);
                console.log(traiteName);
                console.log(traiteDesc);
                console.log('\n\n\n');
                // close the page and get the next hero
                page.close();
                getNextHero(ph,index+1,heroes);
                console.log('');
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



function stripSkinName(str){
  var unescaped = str.replace('\\\'','');
  var strippedSkinName = unescaped.match(/'(.*?)'/);
  return strippedSkinName[1].split('-')[1].trim();
}

function stripStatName(str){
  var first = str.replace(/"/g, ""); 
  var name = first.split(" ").pop();
  return name;
}

function stripStatNumber(str){
  var first = str.replace(/"/g, ""); 
  var finalStat = first.replace( /^\D+/g, '');
  return finalStat;
}

//proto
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

// util
function printObjectinfo(object){
  var output = '';
  for (var property in object) {
    output += property + ': ' + object[property]+'; ';
  }
  console.log(output);
}