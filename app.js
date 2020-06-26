// (!) INFO
// Это основной файл, который запускается

// Конечно сегодня я бы сделал ему CLI-интерфейс управления, 
// а настройки вывел бы как минимум в отдельный JSON-файл который бы проверялся на каждом цикле


// Generic Setup
var fs = require('fs');
var bodyParser = require('body-parser');

const wait = require('util').promisify(setTimeout)
var sec = 1000
var min = 60*sec;
var hour = 60*min;


// =============== ./LIB модули
var rules = require('./lib/rules');
var binom = require('./lib/binom');
var evadav = require('./lib/evadav');

// ---------------------------------------------------
// ---------------------------------------------------
// --------------------S-Y-S-T-E-M--------------------
// ---------------------------------------------------
// ----------------LOW-PAYOUT-STRATEGY----------------
// ---------------------------------------------------

// цикл проверки каждые n-минут
const interval = 5*min;

// info_card - campaign properties  // активные рекламные кампании
var campaign_cards = [
	{	
		name: 'ID - Zeydoo Offers',
		binom_camp: 89,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.08,
    minCtr: 2,
    
	},
	{	
		name: 'Ukr - Push Sub 18+ (black)',
		binom_camp: 91,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.12,
    minCtr: 2,
    
	},
	{	
		name: 'СНГ - Push Subscr. (black)',
		binom_camp: 93,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.01,
    minCtr: 2,
    
	},
	{	
		name: 'IQ - TVBox',
		binom_camp: 94,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.16,
    minCtr: 4,
    
	},
	{	
		name: 'EG - Sofha Play Button',
		binom_camp: 95,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.18,
    minCtr: 4,
    
	},
	{	
		name: 'JP - Boostdev Cleaner',
		binom_camp: 96,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.3,
    minCtr: 4,
    
	},
	{	
		name: 'KR - Boostdev Cleaner',
		binom_camp: 97,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.2,
    minCtr: 4,
    
	},
	{	
		name: 'ID - Zeydoo Offers', // Indonesia - Boostdev Cleaner
		binom_camp: 98,
    
    adnet: 'evadav',
    traffic: 'pop',

    payout : 0.027,
    minCtr: 4,
    
	},
	// {	
	// 	name: 'GR - DATING (black)',
  //   binom_camp: 81,
    
	// 	adnet: 'evadav',
  //   traffic: 'push',    

  //   payout : 0.88,
  //   minCtr: 8,
    
	// },
]

// АВТО ПРАВИЛА  -------------------------------------
var rules_card = {

cutCreatives: {
	action: 'cutCreatives',
	group1: 'creatives',
	group2: 1,
	timeframe: 'last14days',
	

	},	


cutSources: {
	action: 'cutSources',
	group1: 'sources',
	group2: 1,
	timeframe: 'last14days',


	},
}


// > 	СТАРТ ПРАВИЛА  
async function run () {
	await rules.cutCreatives(campaign_cards, rules_card.cutCreatives)
	await rules.cutSources(campaign_cards, rules_card.cutSources)

}

console.log(rules.logDateCampRule())
run();
	
setInterval((e) => {
	console.log(rules.logDateCampRule())
	run();
	// console.log('test')
}, interval)