var arrayMain = [
	{
		name: 'Caren',
		clicks: '239'
	},	
	{
		name: 'Zooo',
		clicks: '155'
	},
	{
		name: 'Blob',
		clicks: '32'
	},	
	{
		name: 'Yen',
		clicks: '911'
	},

]

var arraySearch = ['Yen', 'Caren'];


var aggreg = [];

arrayMain.forEach(function(e){
	arraySearch.forEach(function(v){
		if (e.name == v) aggreg.push(e);
	})
})

console.log(aggreg)