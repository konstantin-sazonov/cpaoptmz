var min = 60000;


//		filters.js
function creatives_byClicks(clicks, ctr){
	return id.clicks > clicks && id.lp_ctr == ctr
}



// ===================================================
// ===================================================
// ---------------------------------------------------
// sweeps_cz_SamsungS8__redCross_чтотоеще

// info_card
var sweeps_cz_SamsungS8 = {
	binom_campaigns : [30,36], // кампании в binom
	payout : 1.8,
};

// Список активных рекламных кампаний
// switch(creatives[i]['adnet']){case 'mgid': }
var creatives = [
	// creative_set 1
		{	
		binom_camp: 36,
		adnet: 'mgid',
		mgid: [	'189274','149088','124789','123989',
					'189274','149088','124789','123989'	],
	},
	// creative_set 2
	{
		binom_camp: 30,
		adnet: 'evadav',
		evadav_high: ['18909','18931','18922','19102'],
		evadav_med: ['18912','18965','18934','19143'],
		evadav_low: ['18931','18924','19116','18825'],
	},
]



// АВТО-ПРАВИЛО #1 ---=---=---=---=---=---=---=---
var rules_cutCreatives = {
	timeframe: 'last14days',
	clicks: 100,
	CTR: 0,
	interval: 60*min,
}

cutCreatives(sweeps_cz_SamsungS8, strategy_cutSources);




// ================================================
// ================================================
// ================================================
// 	rules.js

function cutCreatives(info_card, creatives, rules){
setInterval(function(){
// sweeps_cz_SamsungS8 — выбрать binom-кампанию в info_card, начать с ней работу
info_card.binom_campaigns.forEach(function(binom_campaign){ // 
// creatives — выбор относящегося к binom кампании набора креативов
creatives.forEach(function(creative_set){ 
// если выбранный набор креативов относится к binom-кампании, то начать с ним работу
if (creative_set.binom_camp==binom_campaign) {

	// узнать к какой adnet относится выбранный набор креативов?
	// у каждой adnet свои токены для binom, свой метод подключения к API
	switch (creative_set.adnet) {
		case 'mgid':

			console.log(creative_set.mgid);
			console.log('')
			console.log('CYCLE END');

		break;

		case 'evadav':
			console.log(creative_set.evadav_low);
			console.log(creative_set.evadav_med);
			console.log(creative_set.evadav_high);
			console.log('CYCLE END');
		break;
	}





};  //	/. проверить если creative_set относится к binom_campaign
}); //	/. forEach of creatives[creative_set]
}); //	/. forEach of sweeps_cz_SamsungS8
}, rules.interval);}




