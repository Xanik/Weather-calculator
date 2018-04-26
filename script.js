window.$on = function(target, event, cb){
	target.addEventListener(event, cb, false);
}

var CORE = (function(){
	var modules = {};
	function addModules(module_id, mod){
		modules[module_id] = mod;
	}
	function registerEvents(module_id, evt){
		var theMod = modules[module_id];
		theMod.events = evt;
	}

	function triggerEvents(evt){
		var mod;
		for(index in modules){
			if (modules.hasOwnProperty(index)) {
				mod = modules[index];
				if (mod.events && mod.events[evt.type]) {
					mod.events[evt.type](evt.data);
				}
			}
		}
	}
	return{
		addModules: addModules,
		registerEvents: registerEvents,
		triggerEvents: triggerEvents
	}
})();

var sb = (function(){
	function listen(module_id, mod){
		CORE.registerEvents(module_id, mod);
	}

	function notify(evt){
		CORE.triggerEvents(evt);
	}

	return{
		listen: listen,
		notify: notify
	}
}());

var cel=(function(){
	var id, celsius, add, fahrenheit;

	id = 'figure';

	function init(){

         fahrenheit = document.getElementsByClassName('result')[0];
		 celsius = document.getElementsByClassName('input')[0];
		 add = document.getElementsByClassName('submit')[0];

		$on(add, 'click', displayFahren);

		sb.listen(id, {'calculatec': showCelsius});
	}

	function displayFahren(e){
		var calculator = {};

		calculator.fahrenheit = (celsius.value * (9/5)) + 32;

		sb.notify({
			type: 'calculate',
			data: calculator
		});

		e.preventDefault();
	}
	function showCelsius(figures){
		fahrenheit.value = figures.celsius;
	}
	return{
		id: id,
		init: init,
		displayFahren: displayFahren
	}

}());

var fah=(function(){
	var id, fahrenheit, celsius, add;

	id = 'fahrenheit';

	function init(){
		fahrenheit = document.getElementsByClassName('input')[0];
		 celsius = document.getElementsByClassName('result')[0];
		 add = document.getElementsByClassName('submit')[1];

		 sb.listen(id, {'calculate' : showFahren});

		 $on(add, 'click', displayCelsius)
	}
	function showFahren(figures){
		celsius.value = figures.fahrenheit;
	}
	function displayCelsius(e){
		var calculator = {};

		calculator.celsius = (fahrenheit.value - 32) / (9/5);

		sb.notify({
			type: 'calculatec',
			data: calculator
		});
		e.preventDefault();
	}
	return{
		id: id,
		init: init,
		showFahren: showFahren
	}
}());

CORE.addModules(cel.id, cel);
CORE.addModules(fah.id, fah);

cel.init();
fah.init();