var phantom = require('phantom');
var fs = require('fs');
var select = require('soupselect').select;
var htmlparser = require("htmlparser");

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

                var tempHero = {};
                tempHero.name = heroes[index].name;
                tempHero.slug = heroes[index].slug;
                
                var descriptionHTML = select(dom,'.hero-description');
                var heroDescription = descriptionHTML[0].children[0].raw;
                tempHero.description = heroDescription;

                var skinListHTML = select(dom,'.skin-list li');
                var skins = buildSkins(skinListHTML);
                tempHero.skins = skins;

                var statListHTML = select(dom,'.hero-stats li');
                var stats = buildStats(statListHTML);
                tempHero.stats = stats;

                var roleHTML = select(dom,'.hero-role');
                var role = roleHTML[0].children[0].raw;
                tempHero.role = role;

                var abilityHTML = select(dom,'.abilities-container__wrapper .abilities-container__ability-box .ability-box__data');
                var abilityArr = buildAbilities(abilityHTML);
                tempHero.abilities = abilityArr;

                var traitHTML = select(dom,'.trait-icon-container');
                var trait = buildTrait(traitHTML);
                tempHero.trait = trait;

                console.log(tempHero);

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

function buildAbilities(abilityHTML){
  var abilityArr = [];
  abilityHTML.forEach(function(abil) {

    var abilityImage = 'http://us.battle.net' + abil.children[1].children[1].children[1].children[0].attribs['src'];
    var abilityIcon =      'http://us.battle.net' + abil.children[1].children[3].children[0].attribs['src'];
    var abilityName =      abil.children[3].children[1].children[0].raw;
    var abilityDescription =      abil.children[3].children[3].children[1].children[0].raw;;
    var ability = {abilityImage:abilityImage, abilityIcon:abilityIcon, abilityName:abilityName,abilityDescription:abilityDescription};
    abilityArr.push(ability);

  })

  return abilityArr;
}

function buildTrait(traitHTML){
  var traitIcon = 'http://us.battle.net' + traitHTML[0].children[1].children[1].attribs['src'];
  var traitName = traitHTML[0].children[3].children[1].children[0].raw;
  var traitDescription = traitHTML[0].children[3].children[3].children[0].raw;
  return {traitIcon:traitIcon,traitName:traitName,traitDescription:traitDescription};
}

function buildStats(statListHTML){
  var statArr = [];
  statListHTML.forEach(function(stat) {

    var type = stat.children[1].raw;
    var finalType = stripStatName(type);

    var statTypes = stat.children[3].children[3].raw;
    var finalStatNumber = stripStatNumber(statTypes);

    var stat = {type:finalType,value:finalStatNumber};
    statArr.push(stat);
  })

  return statArr;
}

function buildSkins(skinListHtml){
  var skinArr = [];
  skinListHtml.forEach(function(skin) {
    var skinName = stripSkinName(skin.attribs['data-ng-click']);
    var skinIcon =  'http://us.battle.net' + skin.children[0].attribs['src'];
    var skin = {skinName:skinName,skinIcon:skinIcon};
    skinArr.push(skin);
  })

  return skinArr;

}

// stripping functions
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