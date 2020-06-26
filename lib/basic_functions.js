// =======================  ARRAYS

function list_to_array ( list_string ) {
  var list = list_string.split(' ').join('');
  list_array = list.split(',');
  return list_array;
}


function array_filter(array, condition) {
  
  function action_func (number) {
    return number >= condition;
  }
  
  return array.filter(action_func);
}
// :: demo ::
// let numbers = [2,4,5,52,34,23,12,14,51];
// numbers_filtered = array_filter(numbers, 50)

function array_deleteElement(array, value) {
  position = array.indexOf(value);
  array.splice(position, 1);
  return array;
}


// =======================  MATH
// PERCENTAGE = pct

function pctOf(num1, pct) {
	result = (num1/100)*pct;
	return result.toFixed(1);
}


function pctAB(num1, num2) {
	result = ((num2/num1)*100);
	return result.toFixed(1);
}


// MATH

function average(array){
    let sum = 0;

    for( var i = 0; i < array.length; i++ ){
        sum += parseInt( array[i], 10 ); //don't forget to add the base
    };

    var avg = sum/array.length;
    avg = avg.toFixed(1);

    return avg;
};


// TO-DO

// Volatility function? (difference btw max and min in pct)