// =============== =============== =============== =============== 
// =============  B I N O M  =============

const events = require('events');
const axios = require('axios');

var myEmitter = new events.EventEmitter();
module.exports.myEmitter = myEmitter;


// ================================================

const groups = {
	1: 1,
	sources: 27,
	sourcesEvadav: 27,
	sourcesMgid: 27,
	creatives: 282,
	binom_campaign: 283,
}

const dates = {
	allTime: 9,
	today: 1,
	yesterday: 2,
	last2days: 13,
	last3days: 14,
	last7days: 3,
	last14days: 4,
	lastMonth: 6,
}


// ================================================
// ================================================

// генератор ССЫЛКИ для Binom
function createURL(binom_settings) {
	var myURL = `https://notify-mobile.com/go.php?page=Stats&camp_id=${binom_settings.binom_campaign}&group1=${groups[binom_settings.binom_group1]}&group2=${groups[binom_settings.binom_group2]}&group3=1&date=${dates[binom_settings.binom_date]}&val_page=All&num_page=1&api_key=1000001d1c28e327b5367256327d12dc61aa530`;
	return myURL 	
}


module.exports = {

connect: 
	(async (binom_settings) => {
		
		var url = createURL(binom_settings)
		
		return await axios.get(url)
			.then(res => {return res.data})

	}),

  // Пометить кампанию иконкой (крестик, минус и тп)
setMark: 
	(async  (strategyName, id, mark) => {
		var strategy = strategyName;

		var group1Set = strategy['binom_group1'];
		var group2Set = strategy['binom_group2'];
		var dateSet = strategy['binom_date'];
		var tokenNumber;

		switch (strategy.adnet) {
			case 'mgid':
				switch (group1Set) {
					case 'sourcesMgid':
					case 'sources':
					tokenNumber = 1; 	break;
					case 'creatives':
					tokenNumber = 2; 	break;
					case 'binom_campaign':
					tokenNumber = 3; 	break;
				}; break;
			case 'evadav':
				switch (group1Set) {
					case 'sourcesMgid':
					case 'sources':
					tokenNumber = 1; 	break;
					case 'creatives':
					tokenNumber = 2; 	break;
					case 'binom_campaign':
					tokenNumber = 3; 	break;
				}; break;
		};

		// генератор ССЫЛКИ для Binom
		var myURL = `http://notify-mobile.com/arm.php?action=tokenmark@set&camp_id=${strategy['binom_campaign']}&token_number=${tokenNumber}&token_name=${id}&tag_name=${mark}&api_key=1000001d1c28e327b5367256321d12dc61aa530`;
		await axios.get(myURL)//.then(res => console.log(res.data))

	
})

}





