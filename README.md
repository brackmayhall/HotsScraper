# HotsScraper ![alt tag](https://raw.github.com/brackmayhall/HotsScraper/master/images/claw.png)


Node service for scraping Heroes of the Storm Data from battleNet.

run npm install and package.json file will install required node packages.

- on windows install phantomjs and set path to phantomjs bin folder

- on mac install phantom and set path using the following [this](http://blog.just2us.com/2011/05/setting-path-variable-in-mac-permanently/) tutorial
- then run the mac version "node macScraper.js"
- also xcode command line tools will need to be installed for phantomjs to work

## Required packages
* phantomjs, install this globally(-g) and set PATH to its bin folder
* phantom
* soupselect
* htmlparser
* nedb

## Example output for a Hero
```
{
  "_id": "kaelthas/",
  "name": "Kael'thas",
  "slug": "kaelthas/",
  "youtubeLink": "https://youtu.be/b215Y8QgA3Y",
  "franchise": "warcraft",
  "description": "Like all Blood Elves, Prince Kael'thas was transformed by the fall of Quel'thalas. Desperate to save his people from being consumed by their magical addiction, he joined forces with the Burning Legion and now lords over Tempest Keep.",
  "role": "Assassin",
  "trait": {
    "traitIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_verdantSpheres.jpg",
    "traitName": "Verdant Spheres",
    "traitDescription": "Activate to make your next Basic Ability more powerful."
  },
  "skins": [
    {
      "skinName": "The Sun King",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/kaelthas_theSunKing.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/kaelthas_theSunKing.webm"
    },
    {
      "skinName": "Master Kaelthas",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/kaelthas_masterKaelthas.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/kaelthas_masterKaelthas.webm"
    },
    {
      "skinName": "StormPunk Kaelthas",
      "skinIcon": "http://us.battle.net/heroes/static/images/heroes/skins/thumbnails/kaelthas_stormPunkKaelthas.jpg?v=58-77",
      "videoLink": "http://media.blizzard.com/heroes/videos/heroes/skins/kaelthas_stormPunkKaelthas.webm"
    }
  ],
  "stats": [
    {
      "type": "damage",
      "value": "9"
    },
    {
      "type": "utility",
      "value": "5"
    },
    {
      "type": "survivability",
      "value": "4"
    },
    {
      "type": "complexity",
      "value": "7"
    }
  ],
  "abilities": [
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/kaelthas_flamestrike.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_flamestrike.jpg",
      "abilityName": "Flamestrike",
      "abilityDescription": "After a short delay, deal heavy damage in an area. Verdant Spheres increases the radius by 50% and also increases damage dealt."
    },
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/kaelthas_livingBomb.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_livingBomb.jpg",
      "abilityName": "Living Bomb",
      "abilityDescription": "Deal heavy damage over 3 seconds to an enemy, then they explode dealing moderate damage to all nearby enemies. Casting a second Living Bomb on an enemy causes the previous Living Bomb to explode immediately. Verdant Spheres makes this Ability cost no Mana and have no cooldown."
    },
    {
      "type": "primary",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/kaelthas_gravityLapse.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_gravityLapse.jpg",
      "abilityName": "Gravity Lapse",
      "abilityDescription": "Stun the first enemy hit for 1.5 seconds. Verdant Spheres causes Gravity Lapse to stun the first 3 enemies hit."
    },
    {
      "type": "heroic",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/kaelthas_phoenix.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_phoenix.jpg",
      "abilityName": "Phoenix",
      "abilityDescription": "Launch a Phoenix to an area, dealing light damage to enemies along the way. The Phoenix persists for 7 seconds, attacking enemies for light damage and splashing for 50%."
    },
    {
      "type": "heroic",
      "abilityImage": "http://us.battle.net/heroes/static/images/heroes/skills/thumbnails/kaelthas_pyroblast.jpg",
      "abilityIcon": "http://us.battle.net/heroes/static/images/heroes/skills/icons/kaelthas_pyroblast.jpg",
      "abilityName": "Pyroblast",
      "abilityDescription": "After 2 seconds, cast a slow-moving fireball that deals massive damage to an enemy Hero and nearby enemies."
    }
  ]
}
```

## Todo
* add better hooks for remote sync
* better error checking
* add a sleep mechanism so not constantly hammering battleNet
