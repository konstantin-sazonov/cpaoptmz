var fs = require('fs');
const axios = require('axios');
var binom = require('./binom');
var evadav = require('./evadav'); 
const wait = require('util').promisify(setTimeout)

var sec = 1000
var min = 60*sec;
var hour = 60*min;


// ================================================
//				С Т Р А Т Е Г И И


// ПРАВИЛА: Отсев кампаний/креативов
async function rules_cutCreatives(campaign_card, rules_card, filteredData) {
  var P = campaign_card.payout;	var minCtr = campaign_card.minCtr; 

	var out = {};
	try { if (filteredData.length > 0 ) { out.all 	= filteredData } } catch { out.all = [] }
	out.list = [];

  if (campaign_card.traffic == 'push') {

    for (var id of  out.all) {
      if (	( id.cost > 1*P )   && ( id.leads == 0 ) && (id.lp_ctr < minCtr)
        ||	( id.cost > 1.5*P ) && ( id.leads == 0 )
        ||	( id.cost > 3*P )   && ( id.roi < -60  )
        ||	( id.cost > 5*P )   && ( id.roi < -25  )
        ||	( id.cost > 7*P )   && ( id.roi < 0  )
        ) 
      { 
        out.list.push(id.name)
      }			
    } 
  
  }

	// console.log(out)
	if (out.list.length > 0) console.log('rules_cutCreatives',out.list);
	return await out
}

// ПРАВИЛА: Отсев источников
async function rules_cutSources(campaign_card, rules_card, filteredData) {
	var P = campaign_card.payout;  var minCtr = campaign_card.minCtr;
	
	var out = {};
	out.all 	= filteredData;
	out.list = [];

	
	for (var id  of  out.all ) {
		if (	( id.cost > 1*P ) && ( id.leads == 0 ) && (id.lp_ctr < minCtr)
			||	( id.cost > 2*P ) && ( id.leads == 0 )
			||	( id.cost > 5*P ) && ( id.roi < -60  ) 	
			||	( id.cost > 7*P ) && ( id.roi < -45  )
			) 
		{ 
			out.list.push(id.name)
		}	
	}

	if (out.list.length > 0) console.log('rules_cutSources',out.list);
	return await out
}

// lvl1: ( id.cost > 1*P ) && ( id.leads == 0 ) && (id.lp_ctr < minCtr)

// 	rules_cutSources выдает:
// 		- out.all
// 		- out.list

// 	возвращаем out
	
// 	дальше оно принимается в:
// 		- adnetAction
// 		- setBinomTags




// 				F U N C T I O N S

// Запись лога действий в ./log
function logDateCampRule(campaign_card, rules_card) {

let d = new Date();

var monthZero; var dateZero; 
var hourZero;	var minZero;
if(d.getMonth() < 10) {var monthZero = '0' } else {var monthZero = '' }
if(d.getDate() < 10) {var dateZero = '0' } else {var dateZero = '' }
if(d.getHours() < 10) {var hourZero = '0' } else {var hourZero = '' }
if(d.getMinutes() < 10) {var minZero = '0' } else {var minZero = '' }
var days = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
]

var campaignInfo = '';

if (campaign_card) {
	campaignInfo = `"${campaign_card.binom_camp} | ${campaign_card.name} | ${rules_card.action}"`
}

var log = `

================================
${d.getFullYear()} ${monthZero}${d.getMonth()+1} ${dateZero}${d.getDate()} ${days[d.getDay()]} ${hourZero}${d.getHours()}:${minZero}${d.getMinutes()} 
`+campaignInfo
return log

}


function hello (campaign_card, rules_card) {
console.log()
console.log('————')
console.log('> '+rules_card.action + '\n\r' + campaign_card.binom_camp + ' | ' +campaign_card.name + '\n\r') 
}



// Сформировать параметры запроса Binom для getBinomData()
function binomSettings (campaign_card, rules_card) {

	var today = new Date();
	var dateItem = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate()+'_'+today.getHours()+':'+today.getMinutes();
	var emitterTag = dateItem+'__'+campaign_card.binom_camp+'_'+'cutCreatives';
	var emitterTag_log = dateItem+' '+campaign_card.binom_camp+' '+'cutCreatives';

	// собираем настройки
	var binomSettings = { 
		binom_campaign: campaign_card.binom_camp,
		adnet: campaign_card.adnet,
		binom_group1: rules_card.group1,
		binom_group2: rules_card.group2,
		binom_date: rules_card.timeframe,
		emitterTag: emitterTag,
		emitterTag_log: emitterTag_log,
	}

	return binomSettings;
}

// Получить статистику из Binom
async function getBinomData (campaign_card, rules_card) {
	var binom_settings = binomSettings(campaign_card, rules_card)
	return await binom.connect(binom_settings)
}

// Выбрать объекты БЕЗ иконок cross и minus 
// (чтобы не слать повторные запросы на тех, кто уже в блеклисте)
function checkBinomTags(binom_data, campaign_card) {
	try {
	let filteredData = binom_data.filter(function (id){

		if (id.tags) {
			id_symbol1 = JSON.parse(id.tags);
			switch (id_symbol1.name) {
				case 'plus':
				case 'check':
					return id;
					break;
				default: break;
			};
		}
		
		if (!id.tags && (id.name != '{CAMPAIGN_ID}')) {
			return id;
		};

	});

	try { if (filteredData.length>0) return filteredData } catch { filteredData = []; return filteredData}

	} catch { return filteredData = [] }
}


// Проставить (cross, minus и тп) на исключенные зоны или крео
function setBinomTags (campaign_card, rules_card, blacklist) {
	var binom_settings = binomSettings(campaign_card, rules_card)
	blacklist.forEach(function(id) {
		binom.setMark(binom_settings, id, 'cross');
	});	
	return blacklist;
}

// Отправить запрос в Источник Трафика
// Остановить кампанию, добавить в блэклист и тп.
async function adnetAction (campaign_card, rules_card, data) {
	switch (campaign_card.adnet) {
		case 'evadav':
			
			switch (rules_card.action) {
				case 'cutCreatives':
					console.log('adnetAction | evadav | cutCreatives');
					console.log(data.list);
					await evadav.stopCreatives(data.list)

				break;
				
				case 'cutSources':
					console.log('adnetAction |  evadav | cutSources');
					await evadav.sendBlacklist(campaign_card, rules_card, data)
				break;				

			}

		// >|< записываем log

		break;
	}

	return await data;

}





function stopper (func1, data, campaign_card, rules_card) {

		// console.log('stopper | ', data.length)
		return func1
}


async function optimizeOrPass (data,campaign_card,rules_card, func1,func2) {
	console.log('optimizeOrPass | On')
if (data.list.length > 0) {
		console.log( `optimizeOrPass | ${data.list.length} elements` )
		// Проставить крестики в binom — setBinomTags
		await func1(campaign_card, rules_card, data)
		// остановить кампании в источнике — adnetAction	
		.then(res => console.log('optimizeOrPass | passed '))
		.then(res => func2(campaign_card, rules_card, data.list))
		.then(res => {
			fs.writeFileSync('log/log.json', logDateCampRule(campaign_card, rules_card), {flag:'a'} );
			fs.writeFileSync('log/log.json', `\n\r${JSON.stringify(data.list)}`, {flag:'a'} );

			console.log(`File log.json is ready!`)
		})
	} else  { console.log('optimizeOrPass | Empty input data!') }

};




// 					FINAL FUNCTIONS

module.exports = {

	// Auto Rules

	cutCreatives: 
		(async (campaign_cards, rules_card) => {	
		for (var campaign_card of campaign_cards) {
      // просто сообщение в консоль
      hello (campaign_card, rules_card);

			// запрос статы из binom
			await getBinomData(campaign_card, rules_card).then(data => 
			// выбрать только объекты без binom-иконок
			checkBinomTags(data, campaign_card)).then(data =>
			// отсев крео по условиям
			stopper	( 			rules_cutCreatives(campaign_card, rules_card, data),
									data, campaign_card, rules_card, // передать из global 

						)).then(data => 

			// проверить, что blacklist не пустой
			optimizeOrPass( 	data, campaign_card, rules_card, // передать из global
									// остановить крео в источнике
									adnetAction,  
									// проставить крестики на выключенных
									setBinomTags
								)

			).then(async (res) => await wait(2*sec)) // просто пауза, чтобы не попадать на rate limit
		}
		}),

	cutSources: 
		(async (campaign_cards, rules_card) => {
		for (var campaign_card of campaign_cards) {
			hello (campaign_card, rules_card);

			// запрос статы из binom
			await getBinomData(campaign_card, rules_card).then(data => 
			// выбрать только объекты без binom-иконок
			checkBinomTags(data, campaign_card)).then(data =>
			// отсев крео по условиям
			stopper	( 			rules_cutSources(campaign_card, rules_card, data),
									data, campaign_card, rules_card, // передать из global 

						)).then(data => 

			// проверить, что blacklist не пустой
			optimizeOrPass( 	data, campaign_card, rules_card, // передать из global
									// добавить сорсы в блэклист в источнике
									adnetAction, 
									// проставить крестики на выключенных
									setBinomTags
								) 

			).then(async (res) => await wait(2*sec))
		}
		}),


	
	// General Functions
	binomSettings: binomSettings,
	getBinomData: getBinomData,
	checkBinomTags: checkBinomTags,

	// Utils
	logDateCampRule: logDateCampRule,


}




