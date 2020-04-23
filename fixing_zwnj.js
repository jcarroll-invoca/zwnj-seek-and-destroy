// Hidden (non-printable) Character Detection & Replacement.
//
// Notes:
//		This solution (a "bandaid" approach) is for https://www.exede.com/ which has some hidden characters around
//		the telephone number, making it very difficult (if not impossible) to do number replacement.
//
//		Its purpose is to find all (or some) non-printable characters and replace them PRIOR to the Invoca Tag running.
//		
//		NB: you cannot see the invisible non-printable characters, but the little gremlins are hidden in there.
//			This script also assumes you have jQuery loaded. 
//			Example Hidden Char:
//				var zwnjChar = '‌' // &zwnj is embedded in this;
//
// Last Updated:  April 22, 2020
// Authors: Megan Haubelt & J Carroll
// Email: mhaubelt@invoca.com & jcarroll@invoca.com

var editedNodes = [];
var skippedNodes = [];
var searchCrit = '*:contains("‌")' // embedded/hidden &zwnj char.
var regexCharCrit = /‌/g; // use this -> for ALL 'fun' characters  = /[^\w\s.,!@#$%^&*()=+~`-]/g;
var replaceWithThisChar = ''; //no character

var DEBUG_MODE = false; //used for print statements in the log()...


function log(string, arrayOfValues) {
	if (!DEBUG_MODE) {
		return;
	}
	console.info(string, arrayOfValues);
}


function time_perfornance(fnName, callback) {
	console.time(fnName);
	callback();
	return console.timeEnd(fnName);
}


function get_DOMOffenders (findThis) {
	if (!findThis) {
		findThis = searchCrit;
	}
	return $(findThis)
}


function replace_zwnjCharPhoneNumbers() {
	// Go over each and find dom elements that have a text property 
	// and replace the zero-width non joiner character.
	var eleOffenders = get_DOMOffenders();

	for (var i=1; i < eleOffenders.length; i++) {
		var eleUno = eleOffenders[i];
		
		if (eleUno.text) {
			eleUno.text = eleUno.text.replace(regexCharCrit, replaceWithThisChar);
			editedNodes.push(eleUno);
			log("Edited this element ->", [eleUno]);
		} else { 
			skippedNodes.push(eleUno);
			log("Skipped this element ->", [eleUno]);
		}
	}
}


function putBack_zwnjCharPhoneNumbers() {
	for (var j = 0; j < editedNodes.length; j++) {
		editedNodes[j].text = editedNodes[j].text.replace(/-/g, '‌-‌'); // hidden characters dwell in silence here... &zwnj;
	}

	_purge_editedNodes();
}


function _purge_editedNodes() {
	//clear editedNodes so we don't get duplicates...
	editedNodes = [];
}


function main() {
	log("Searching for zero-width non-joiners on phone numbers...");
	if (DEBUG_MODE) {
		time_perfornance(replace_zwnjCharPhoneNumbers);
		//measurePerfornance(putBack_zwnjCharPhoneNumbers);
	} else {
		replace_zwnjCharPhoneNumbers();
	}
	log("Done with the search...");
}

function _clock_performance() {
	time_perfornance("This is how long it takes to strip the invisible chars ~", replace_zwnjCharPhoneNumbers);
	time_perfornance("This is how long it takes to add back the invisible chars ~", putBack_zwnjCharPhoneNumbers);
}


main();


