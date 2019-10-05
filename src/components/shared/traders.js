const traders = [
{
		id: 54,
		character: 'Unknown Character',
		name: 'The Pre-Bakery',
		blurb: 'All the ingredients, none of the bread!',
		level: 5,
		weighting: 10,
},
{
		id: 55,
		character: 'Unknown Character',
		name: 'Fruit Stand',
		blurb: 'All of your five a day.',
		level: 10,
		weighting: 15,
},
{
		id: 56,
		character: 'Unknown Character',
		name: 'The Sweet Spot',
		blurb: 'Careful, they\'ll rot your teeth.',
		level: 15,
		weighting: 20,
},
{
		id: 1,
		character: 'Sean Keeper',
		name: 'The Scraps',
		blurb: 'I was gonna chuck this stuff out.. you interested?',
		level: 0,
		weighting: 60,
},
{
		id: 2,
		character: 'Sean Keeper',
		name: 'Lots More Ore',
		blurb: 'Lots and and lots and lots of ore!',
		level: 0,
		weighting: 100,
},
{
		id: 3,
		character: 'Sean Keeper',
		name: 'The Off Cuts',
		blurb: 'This stuff isn\'t the best, but it\'ll do.',
		level: 5,
		weighting: 40,
},
{
		id: 4,
		character: 'Sean Keeper',
		name: 'The Backbone',
		blurb: 'You\'re gonna like what I\'ve got. I think.',
		level: 10,
		weighting: 15,
},
{
		id: 5,
		character: 'Sean Keeper',
		name: 'The Prime Cuts',
		blurb: 'My very best stock, for the connoisseur.',
		level: 15,
		weighting: 5,
},
{
		id: 6,
		character: 'The Iron Knight',
		name: 'The Iron Throne',
		blurb: 'I rule my iron with an iron fist!',
		level: 0,
		weighting: 5,
},
{
		id: 7,
		character: 'The Iron Knight',
		name: 'The Iron Fist',
		blurb: 'I rule my iron from an iron throne!',
		level: 25,
		weighting: 1,
},
{
		id: 8,
		character: 'The Golden Warrior',
		name: 'The Nuggets',
		blurb: 'Check out these lil shiners.',
		level: 5,
		weighting: 1,
},
{
		id: 9,
		character: 'The Golden Warrior',
		name: 'The Nougat',
		blurb: 'Panned these all myself, honest!',
		level: 15,
		weighting: 1,
},
{
		id: 10,
		character: 'The Golden Warrior',
		name: 'The Golden Boulders',
		blurb: 'Check out these lil shiners.',
		level: 35,
		weighting: 1,
},
{
		id: 11,
		character: 'Cloth King',
		name: 'A Straight Cut',
		blurb: 'Definitely not off the back of a cart.',
		level: 0,
		weighting: 10,
},
{
		id: 12,
		character: 'Cloth King',
		name: 'A Finer Cut',
		blurb: 'Reams upon reams of high quality cloth.',
		level: 15,
		weighting: 2,
},
{
		id: 13,
		character: 'Woodchuck',
		name: 'Logged In',
		blurb: 'LOGS! LOOOGS! LOTSA LOOOOOOGS!!!',
		level: 0,
		weighting: 30,
},
{
		id: 14,
		character: 'Oog',
		name: 'Oog',
		blurb: 'OOG. OOG. OOG.',
		level: 15,
		weighting: 3,
},
{
		id: 15,
		character: 'GemBot 5000',
		name: 'GemBooth 1000',
		blurb: 'Bzzt! Buy gems!',
		level: 10,
		weighting: 3,
},
{
		id: 16,
		character: 'GemBot 5000',
		name: 'GemEmporium 5000',
		blurb: 'Bzzt! Buy BETTER gems!',
		level: 25,
		weighting: 2,
},
{
		id: 17,
		character: 'GemBot 5000',
		name: 'GemCrusher 9000',
		blurb: 'Bzzt! Buy BROKEN gems!',
		level: 25,
		weighting: 4,
},
{
		id: 18,
		character: 'Farmer\'s Little Friend',
		name: 'Farmyard Funland',
		blurb: 'All the fun of the farm!',
		level: 5,
		weighting: 25,
},
{
		id: 19,
		character: 'Farmer\'s Little Friend',
		name: 'Baker\'s Dozen',
		blurb: 'What, a plant can\'t run a business?',
		level: 5,
		weighting: 25,
},
{
		id: 20,
		character: 'Death Beetle',
		name: 'The Exclusive Emporium',
		blurb: 'You won\'t find any of this anywhere else!',
		level: 30,
		weighting: 1,
},
{
		id: 21,
		character: 'Miss Odds & Ends',
		name: 'The Little Ore Shop',
		blurb: 'A little ore in store, you it is for!',
		level: 0,
		weighting: 50,
},
{
		id: 22,
		character: 'Miss Odds & Ends',
		name: 'The Little Bar Shop',
		blurb: 'Some bars inside, no need to hide.',
		level: 0,
		weighting: 50,
},
{
		id: 23,
		character: 'Miss Odds & Ends',
		name: 'The Bigger Ore Shop',
		blurb: 'Ore? A lot, that\'s what I\'ve got.',
		level: 10,
		weighting: 25,
},
{
		id: 24,
		character: 'Miss Odds & Ends',
		name: 'The Bigger Bar Shop',
		blurb: 'Lots more bars, don\'t go fars!',
		level: 10,
		weighting: 25,
},
{
		id: 25,
		character: 'Miss Odds & Ends',
		name: 'The Biggest Ore Shop',
		blurb: 'Ore to the max, racks and racks.',
		level: 20,
		weighting: 8,
},
{
		id: 26,
		character: 'Miss Odds & Ends',
		name: 'The Biggest Bar Shop',
		blurb: 'So many bars, enough to fill Mars.',
		level: 20,
		weighting: 8,
},
{
		id: 27,
		character: 'Deathly Ghoul',
		name: 'The Scary Silk Shop',
		blurb: 'About as scary as regular silk.',
		level: 0,
		weighting: 80,
},
{
		id: 28,
		character: 'Deathly Ghoul',
		name: 'The Lethal Log Lair',
		blurb: 'About as lethal as any old log.',
		level: 5,
		weighting: 35,
},
{
		id: 29,
		character: 'Deathly Ghoul',
		name: 'The Petrifying Powder Place',
		blurb: 'Powder can be scary! Course it can!',
		level: 30,
		weighting: 12,
},
{
		id: 30,
		character: 'Bleached Crab',
		name: 'Surf and Steel',
		blurb: 'Don\'t steal my steel.',
		level: 10,
		weighting: 50,
},
{
		id: 31,
		character: 'Bleached Crab',
		name: 'Manatees and Mithril',
		blurb: 'I won\'t mith my mithril. I mean miss.',
		level: 20,
		weighting: 35,
},
{
		id: 32,
		character: 'Bleached Crab',
		name: 'Atolls and Adamant',
		blurb: 'I\'m adamant you\'ll like my adamant.',
		level: 30,
		weighting: 30,
},
{
		id: 33,
		character: 'Bleached Crab',
		name: 'Reefs and Rune',
		blurb: 'Don\'t rune away!',
		level: 40,
		weighting: 30,
},
{
		id: 34,
		character: 'Bleached Crab',
		name: 'Dives and Dragon',
		blurb: 'Forged from seadragon hide.',
		level: 50,
		weighting: 20,
},
{
		id: 35,
		character: 'Goblin Warrior',
		name: 'Swords a\'plenty!',
		blurb: 'Get your swords here!',
		level: 0,
		weighting: 5,
},
{
		id: 36,
		character: 'Goblin Warrior',
		name: 'Shields a\'plenty!',
		blurb: 'Get your shields here!',
		level: 0,
		weighting: 5,
},
{
		id: 37,
		character: 'Goblin Warrior',
		name: 'Armour a\'plenty!',
		blurb: 'Get your armour here!',
		level: 0,
		weighting: 5,
},
{
		id: 38,
		character: 'Floating Tradesman',
		name: 'The Floating Fruitmonger',
		blurb: 'It\'s all technically fruit!',
		level: 5,
		weighting: 20,
},
{
		id: 39,
		character: 'Floating Tradesman',
		name: 'The Fromage Fermenter',
		blurb: 'Finely fermented, frankly.',
		level: 5,
		weighting: 20,
},
{
		id: 40,
		character: 'Floating Tradesman',
		name: 'Mill Hill',
		blurb: 'Baker\'s dozens!',
		level: 5,
		weighting: 20,
},
{
		id: 41,
		character: 'Floating Tradesman',
		name: 'Bloodsucker\'s Boxes',
		blurb: 'Don\'t ask how I got this.',
		level: 5,
		weighting: 20,
},
{
		id: 42,
		character: 'Goblin Businessman',
		name: 'Runic Remedies',
		blurb: 'The finest rune resources in the land!',
		level: 40,
		weighting: 40,
},
{
		id: 43,
		character: 'Goblin Businessman',
		name: 'Dragon Delights',
		blurb: 'All 100% gen-u-ine dragon.',
		level: 50,
		weighting: 20,
},
{
		id: 44,
		character: 'Blobette',
		name: 'Silver Waistbands',
		blurb: 'For blobs only!',
		level: 10,
		weighting: 2,
},
{
		id: 45,
		character: 'Blobette',
		name: 'Gold Belts',
		blurb: 'For fancy blobs only!',
		level: 15,
		weighting: 2,
},
{
		id: 46,
		character: 'Ricky Stardust',
		name: 'Space Ores',
		blurb: 'Fresh off the asteroid.',
		level: 0,
		weighting: 75,
},
{
		id: 47,
		character: 'Ricky Stardust',
		name: 'Space Bars',
		blurb: 'From the slightly more advanced asteroids.',
		level: 0,
		weighting: 40,
},
{
		id: 48,
		character: 'Ricky Stardust',
		name: 'Space Gems',
		blurb: 'Formed when a space rock meets high G-forces.',
		level: 10,
		weighting: 2,
},
{
		id: 49,
		character: 'Grumblestiltskin',
		name: 'My Stuff',
		blurb: 'Not for sale. Go away.',
		level: 0,
		weighting: 15,
},
{
		id: 50,
		character: 'Grumblestiltskin',
		name: 'Still My Stuff',
		blurb: 'I\'m hanging onto this. Shoo.',
		level: 30,
		weighting: 5,
},
{
		id: 51,
		character: 'Oculus Lift',
		name: 'Opticians',
		blurb: 'Well, they help protect your eyes at least.',
		level: 15,
		weighting: 25,
},
{
		id: 52,
		character: 'Blob King',
		name: 'The King\'s Armoury',
		blurb: 'Buy the very best.',
		level: 50,
		weighting: 50,
},
{
		id: 53,
		character: 'Blob King',
		name: 'The King\'s Weapon Rack',
		blurb: 'Buy the very best.',
		level: 50,
		weighting: 50,
},
];

export default traders;
