console.log()
console.log('started')

class Main {
		constructor(param1, param2){
			this.name = param1;
			this.color = param2 + ' apple';
		}

		func1(){
			console.log('Function 1 is working fine')
		}
		func2(){
			console.log('Function 2 is working fine')
		}
}

var mainNew = new Main('Belator', 'Red');

/*
mainNew.func1();
console.log(mainNew.color);
*/

module.exports = { 	Main: Main, 
										mainNew: mainNew }