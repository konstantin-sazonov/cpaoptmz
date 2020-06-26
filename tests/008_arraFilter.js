// info_card
var sweeps_cz_SamsungS8 = {
	binom_campaigns : [30,36], // кампании в binom
	payout : 1.8, 
};

// Список активных рекламных кампаний
// switch(creatives[i]['adnet']){case 'mgid': }
var creatives = [
	{	
		binom_camp: 36,
		adnet: 'mgid',
		mgid: [	'189274','149088','124789','123989',
					'189274','149088','124789','123989'	],
	},
	{
		binom_camp: 30,
		adnet: 'evadav',
		evadav_high: ['18909','18931','18922','19102'],
		evadav_med: ['18912','18965','18934','19143'],
		evadav_low: ['18931','18924','19116','18825'],
	},
]


///////////////////////////////////////////////////////////////////////

// sweeps_cz_SamsungS8 — выбор кампании binom в info_card, то начать с ней работу
sweeps_cz_SamsungS8.binom_campaigns.forEach(function(binom_campaign){ // 
// creatives — выбор относящегося к binom кампании набора креативов
// если набор креативов относится к binom-кампании, то начать с ним работу
creatives.forEach(function(creative_set){ if (creative_set.binom_camp==binom_campaign) {

	console.log(creative_set.binom_camp)
	console.log(creative_set.adnet)
	// выбранный набор креативов - к какому источнику он относится?
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



		};
	});


}); //	/. forEach of sweeps_cz_SamsungS8




function array_filter(array, condition) {
  
  function action_func (number) {
    return number >= condition;
  }
  
  return array.filter(action_func);
}