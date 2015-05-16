var phantom = require('phantom');
var fs = require('fs');
var select = require('soupselect').select;
var htmlparser = require("htmlparser");
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'localHotsNeDb', autoload: true });

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


    page.open('http://us.battle.net/heroes/en/heroes/'+heroes[index].slug, function (status) {

      page.evaluate(function () { return document.documentElement.innerHTML; }, function (result) {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                console.log("Error: " + err);
            } else {

                var tempHero = {};
                tempHero._id = heroes[index].slug;
                tempHero.name = heroes[index].name;
                tempHero.slug = heroes[index].slug;

                tempHero.youtubeLink = buildHeroYouTubeLink(select(dom,'.hero-spotlight-main'));

                var franchiseHTML = select(dom,'.franchise-icon');
                tempHero.franchise = buildHeroFranchise(franchiseHTML);;                

                var descriptionHTML = select(dom,'.hero-description');
                tempHero.description = buildHeroDescription(descriptionHTML);                

                var roleHTML = select(dom,'.hero-role');
                tempHero.role = buildHeroRole(roleHTML);
                
                var traitHTML = select(dom,'.trait-icon-container');
                tempHero.trait = buildHeroTrait(traitHTML);
                
                var heroWebVideoHTML = select(dom,'.hero-skin');
                var webVideoArr = buildHeroWebVideoLinks(heroWebVideoHTML,heroes[index].slug);
                
                var skinListHTML = select(dom,'.skin-list li');
                var skins = buildHeroSkins(skinListHTML,webVideoArr);
                tempHero.skins = skins;                

                var statListHTML = select(dom,'.hero-stats li');
                tempHero.stats = buildHeroStats(statListHTML);

                var abilityHTML = select(dom,'.abilities-container__wrapper .abilities-container__ability-box .ability-box__data');
                var abilityArr = buildAHerobilities(abilityHTML);
                tempHero.abilities = abilityArr;

                //console.log(tempHero);

                db.findOne({ _id: tempHero._id }, function (err, doc) {
                  // doc is the document Mars
                  // If no document is found, doc is null
                  if(doc != null) {
                    if(JSON.stringify(tempHero) === JSON.stringify(doc) ){
                      console.log('same');
                    } else {
                      console.log('update');
                      updateHero(tempHero);
                    }
                  } else {
                    console.log('do an insert');
                      insertHero(tempHero);
                  }

                  //console.log(doc);
                });

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

function insertHero(tempHero){
  db.insert(tempHero, function (err, newDoc) {   // Callback is optional
    console.log(tempHero.name + ' inserted');
    syncRemoteDatabase();
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
  });
}

function updateHero(tempHero){
  db.update({ _id: tempHero._id }, tempHero, {}, function (err, numReplaced) {
    console.log(tempHero.name + ' updated');
    syncRemoteDatabase();
    // numReplaced = 1
    // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' }
    // Note that the _id is kept unchanged, and the document has been replaced
    // (the 'system' and inhabited fields are not here anymore)
  });
}

function syncRemoteDatabase(){
  console.log('sync remote database');
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

function buildHeroYouTubeLink(heroYouTubeHTML){

  var youtubeLink = '';

  try {
    youtubeLink =  'https://youtu.be/' + heroYouTubeHTML[0].children[1].attribs['data-src'];
  }
  catch (e) {
    return youtubeLink;
  }
   
  return youtubeLink;
}

function buildHeroFranchise(franchiseHTML){

  var name = '';
  
  try {
    var str = franchiseHTML[0].attribs['class'];
    name =  str.split(" ").pop();
  }
  catch (e) {
    return youtnameubeLink;
  }

  return name;
}

function buildHeroDescription(descriptionHTML){

  var description = '';
  
  try {
    description = descriptionHTML[0].children[0].raw;;
  }
  catch (e) {
    return description;
  }

  return description;
}

function buildHeroRole(roleHTML){

  var role = '';
  
  try {
    role = roleHTML[0].children[0].raw;
  }
  catch (e) {
    return role;
  }

  return role;

}

function buildHeroTrait(traitHTML){

  var trait = {};
  try {
    var traitIcon = 'http://us.battle.net' + traitHTML[0].children[1].children[1].attribs['src'];
    var traitName = traitHTML[0].children[3].children[1].children[0].raw;
    var traitDescription = traitHTML[0].children[3].children[3].children[0].raw;

    trait = {traitIcon:traitIcon,traitName:traitName,traitDescription:traitDescription};
  }
  catch (e) {
    return trait;
  }

  return trait;
}

// TODO merge this with skin
// stripping functions
function buildHeroWebVideoLinks(heroWebVideoHTML,heroSlug){
  var webVideoArr = [];

  heroWebVideoHTML.forEach(function(skin) {

    try {
      var temp = skin.raw.replace(/"/g, "");

      var temp2 = temp.replace(/selected/g,'');
      var temp3 = temp2.trim();
      var temp4 = temp3.split(" ").pop();
      var temp5 = temp4.trim();

      var finalHeroSlug = heroSlug.replace('/','');

      var finalVid = 'http://media.blizzard.com/heroes/videos/heroes/skins/'+finalHeroSlug+'_'+temp5+'.webm';
      webVideoArr.push({name:temp5,videoLink:finalVid});

    }
    catch (e) {
      console.log(e);
    }

  })

  return webVideoArr;
}


function buildHeroSkins(skinListHtml,webVideoArr){
  var skinArr = [];
  skinListHtml.forEach(function(skin) {
    try {
      var temp1 = skin.raw;
      var temp2 = temp1.replace(/"|'|}/g, ""); 
      var re = /.*==\s+(.*)\s+data-ng-click.*/;
      var temp3 = temp2.replace(re, "$1");
      var temp4 = temp3.trim();

      var videoLinkObj = webVideoArr.filter(function(e) { return e.name === temp4; });

      var skinName = stripSkinName(skin.attribs['data-ng-click']);
      var skinIcon =  'http://us.battle.net' + skin.children[0].attribs['src'];

      var skin = {};
      if(videoLinkObj.length > 0){
        skin = {skinName:skinName,skinIcon:skinIcon,videoLink:videoLinkObj[0].videoLink};
      } else{
          skin = {skinName:skinName,skinIcon:skinIcon,videoLink:null};
      }


      skinArr.push(skin);
    }
    catch (e) {
      console.log(e);
    }

  })

  return skinArr;

}


function buildHeroStats(statListHTML){
  var statArr = [];
  try {
    statListHTML.forEach(function(stat) {

      var type = stat.children[1].raw;
      var finalType = stripStatName(type);

      var statTypes = stat.children[3].children[3].raw;
      var finalStatNumber = stripStatNumber(statTypes);

      var stat = {type:finalType,value:finalStatNumber};
      statArr.push(stat);
    })
  } catch(e){
    console.log(e);
  }

  return statArr;
}



// TODO distinguish between heroic and primary
function buildAHerobilities(abilityHTML){
  var abilityArr = [];

  abilityHTML.forEach(function(abil,index) {

    var type = 'primary';
    if(index > 2){
      type = 'heroic';
    }

    var abilityImage = 'http://us.battle.net' + abil.children[1].children[1].children[1].children[0].attribs['src'];
    var abilityIcon =      'http://us.battle.net' + abil.children[1].children[3].children[0].attribs['src'];
    var abilityName =      abil.children[3].children[1].children[0].raw;
    var abilityDescription =      abil.children[3].children[3].children[1].children[0].raw;;
    var ability = {type:type,abilityImage:abilityImage, abilityIcon:abilityIcon, abilityName:abilityName,abilityDescription:abilityDescription};
    abilityArr.push(ability);

  })

  return abilityArr;
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