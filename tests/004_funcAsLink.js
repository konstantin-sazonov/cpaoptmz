console.log();

let campaign = 37
let apiKey = '13FK4'


function url(campaign, group, date, api_key){

	let grouping = {
		sources: 27,
		campaign: 282,
		creative: 283,
	}

	let dates = {
	allTime: 9,
	today: 1,
	yesterday: 2,
	last2days: 13,
	last3days: 14,
	last7days: 3,
	last14days: 4,
	}

	return(`baseurl.com/test/${campaign}/${grouping[group]}/${dates[date]}/${api_key}`)
}


function callApi(url) {
	let something = 'text/' + url
	console.log(something)
};


callApi(url(37, 'sources', 'yesterday', apiKey))

console.log();