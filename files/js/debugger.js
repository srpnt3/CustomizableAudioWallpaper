document.addEventListener("DOMContentLoaded", function (e) {
	startDebugger(false);
});

function startDebugger(multiLine) {

	creaeteElement();
	var x = document.getElementById("debug").lastElementChild.innerHTML;

	if (typeof console !== "undefined") {
		if (typeof console.log !== 'undefined') {
			console.olog = console.log;
		} else {
			console.olog = function () {
			};
		}
	}

	console.log = function (message) {
		console.olog(message);
		log(message);
	};

	console.error = console.debug = console.info = console.log;

	function creaeteElement() {
		document.body.innerHTML += "<div id=\"debug\"><h1>Debug</h1><h2>...</h2></div>";
	}

	function log(message) {
		if (multiLine) {
			if (x === "...") x = message;
			else x += "<br>" + message;
		} else {
			x = message;
		}
	}

}
