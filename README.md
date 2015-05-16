# HotsScraper ![alt tag](https://raw.github.com/brackmayhall/HotsScraper/master/images/claw.png)


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
* 

```
{
  "_id": "abathur/",
  "name": "Abathur",
  "slug": "abathur/",
  "youtubeLink": "",
  "franchise": "starcraft",
  "description": "Abathur, the Evolution Master of Kerrigan's Swarm, works ceaselessly to improve the Zerg from the genetic level up. His hate for chaos and imperfection almost rivals his hatred of pronouns.",
  "role": "Specialist",
  "trait": {
    "traitIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/abathur_locustStrain.jpg",
    "traitName": "Locust Strain",
    "traitDescription": "Spawns a Locust to attack down the nearest lane every 15 seconds. Locusts last for 25 seconds."
  },
  "skins": [
    {
      "skinName": "Evolution Master",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/abathur_evolutionMaster.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/abathur_evolutionMaster.webm"
    },
    {
      "skinName": "Master Abathur",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/abathur_masterAbathur.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/abathur_masterAbathur.webm"
    },
    {
      "skinName": "Pajamathur Abathur",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/abathur_pajamathurAbathur.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/abathur_pajamathurAbathur.webm"
    },
    {
      "skinName": "Skelethur Abathur",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/abathur_skelethurAbathur.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/abathur_skelethurAbathur.webm"
    }
  ],
  "stats": [
    {
      "type": "damage",
      "value": "3"
    },
    {
      "type": "utility",
      "value": "7"
    },
    {
      "type": "survivability",
      "value": "1"
    },
    {
      "type": "complexity",
      "value": "9"
    }
  ],
  "abilities": [
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/abathur_symbiote.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/abathur_symbiote.jpg",
      "abilityName": "Symbiote",
      "abilityDescription": "Assist another allied Unit or Combat Structure, allowing you to shield them and use new Abilities.  Cannot be used on another Hero's Summons."
    },
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/abathur_toxicNest.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/abathur_toxicNest.jpg",
      "abilityName": "Toxic Nest",
      "abilityDescription": "Spawn a mine that becomes active after a short time. Deals moderate damage and reveals the enemy for 4 seconds. Lasts 90 seconds."
    },
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/abathur_ultimateEvolution.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/abathur_ultimateEvolution.jpg",
      "abilityName": "Ultimate Evolution",
      "abilityDescription": "Clone target allied Hero and control it for 20 seconds. Abathur has perfected the clone, granting it 20% Ability Power, 20% bonus Attack Damage, and 10% bonus Movement Speed. Cannot use their Heroic Ability."
    },
    {
      "type": "heroic",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/abathur_evolveMonstrosity.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/abathur_evolveMonstrosity.jpg",
      "abilityName": "Evolve Monstrosity",
      "abilityDescription": "Turn an allied Minion or Locust into a Monstrosity. When enemy Minions near the Monstrosity die, it gains 5% Health and 5% Basic Attack damage, stacking up to 30 times. The Monstrosity takes 50% less damage from Minions and Structures.  Using Symbiote on the Monstrosity allows you to control it, in addition to Symbiote's normal benefits."
    }
  ]
}
```
