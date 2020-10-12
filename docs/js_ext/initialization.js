const {PARAMS, diffDays, formatPrice, toDate, fromDate, encData, cleanElement, getElementById}  = require('./utils.js');
const TARGETES = require('./targetes.js');

module.exports = {
	init: _=>{
		getElementById("form-submit").onsubmit = ev=>localStorage.setItem("d", encData(loadOutputData()));
		getElementById("uni").onchange = onChangeUni;
		getElementById("reset-fields").onclick = resetFields;
	},
	load: _=>{
		let tbodyTargetes = document.querySelector("#tickets tbody");
		cleanElement(tbodyTargetes);

		// CONSTRUIR TAULA DE TARGETES:
		let totalZones = 0;
		TARGETES.map(t=>{
			let row = document.createElement("tr");
			row.className = "ticket";
			row.class = t;

			let tName = document.createElement("td");
			tName.innerHTML = t.nom;
			tName.className = "nom";

			let tPreu = document.createElement("td");
			tPreu.innerHTML = formatPrice(t.preus[0], "€");
			tPreu.className = "preu";

			row.appendChild(tName);
			row.appendChild(tPreu);

			if (t.zones > totalZones) {
				totalZones = t.zones;
			}

			return row;

		}).forEach(t=>tbodyTargetes.appendChild(t));

		var temp = getElementById("table-extra-columns");
		var clon = temp.content.cloneNode(true);
		Array.from(clon.children).forEach(td=>td.rowSpan = TARGETES.length);

		tbodyTargetes.firstChild.appendChild(clon);

		// CONSTUIR COMBO DE ZONES:
		let zonesSelect = getElementById("zones-selector");
		cleanElement(zonesSelect);

		zonesSelect.onchange = ev=>actualitzarPreus(zonesSelect.value);

		for (let i=1; i<=totalZones; i++) {
			let option = document.createElement("option");
			option.innerHTML = "Zona "+i;
			option.value = i;
			zonesSelect.appendChild(option);
		}

		// CONFIGURAR AVUI COM A PRIMER DIA
		let dateIni = getElementById("dateini");
		let dateEnd = getElementById("dateend");
		let addDays = getElementById("adddays");

		let today = new Date();
		dateIni.value = fromDate(today);
		today.setDate(today.getDate()+parseInt(addDays.value));
		dateEnd.value = fromDate(today);

		addDays.onchange =
		addDays.onkeyup = ev=>{
			let validDates = checkValidityDates(dateIni);

			if (validDates) {
				let val = parseInt(addDays.value) || 0;

				let initDate = toDate(dateIni.value);
				initDate.setDate(initDate.getDate()+val);
				dateEnd.value = fromDate(initDate);
			}
		}

		dateEnd.onblur =
		dateIni.onblur = ev=>{
			let validDates = checkValidityDates(dateIni, dateEnd);
		
			if (validDates) {
				let iDate = toDate(dateIni.value);
				let eDate = toDate(dateEnd.value);

				addDays.value = diffDays(eDate,iDate);
			}
		}


		// BOTÓ EXCEPCIONS
		getElementById("exceptions-button").onclick = ev=>{
			getElementById("form-submit").action="./excepcions.html";
		}


		loadEntryData();
	}
}

function onChangeUni(ev){
	let jove = getElementById("jove");
	let uni = jove.disabled = ev.target.checked;
	if (uni) {
		jove.checked = false;
	}
}

function resetFields(ev) {
	localStorage.setItem("d", "e301");
	localStorage.clear();
	location.reload();
	return false;
}

function actualitzarPreus(zona) {
	document.querySelectorAll("#tickets .ticket")
		.forEach(row=>{
			if (row.class.zones < zona) {
				row.querySelector(".preu").innerHTML = "";
			} else {
				row.querySelector(".preu").innerHTML = formatPrice(row.class.preus[zona-1], "€");
			}
		})
}


function loadEntryData(){
	function ifSetValue(id, value) {
		if (value) {
			let el = getElementById(id);
			if (el) el.value = value;
		}
	}

	function ifSetChecked(id, value) {
		if (value) {
			let el = getElementById(id);
			if (el)	el.checked = value=='on';
		}
	}

	if (PARAMS.dia) {
		ifSetValue('dill',PARAMS.dia[0]);
		ifSetValue('dima',PARAMS.dia[1]);
		ifSetValue('dime',PARAMS.dia[2]);
		ifSetValue('dijo',PARAMS.dia[3]);
		ifSetValue('dive',PARAMS.dia[4]);
		ifSetValue('diss',PARAMS.dia[5]);
		ifSetValue('dium',PARAMS.dia[6]);
	}

	ifSetValue('dateini',PARAMS.ini);
	ifSetValue('dateend',PARAMS.end);

	ifSetValue('exceptions', JSON.stringify(PARAMS.exceptions));
	ifSetValue('zones-selector',PARAMS.z);

	ifSetChecked('jove',PARAMS.jove);
	ifSetChecked('uni', PARAMS.uni==undefined? "on" : PARAMS.uni);
	if (!getElementById("uni").checked) {
		getElementById("jove").disabled = false;;
	}

	getElementById('dateini').onblur();
	getElementById('zones-selector').onchange();
}

function loadOutputData(){
	let form = getElementById("form");

	return [...form.querySelectorAll("select,input")]
		.filter(el=>el.name)
		.sort((a,b)=>a.name>b.name?1:a.name<b.name?-1:0)
		.reduce((obj,el)=>{
			if (el.type != "checkbox") {

				if (el.name.match(/^d\d$/)) {
					if (obj.dia) obj.dia.push(parseInt(el.value));
					else obj.dia = [parseInt(el.value)];
				} else if (el.name == 'exceptions') {
					obj['exceptions'] = JSON.parse(el.value);
				} else {
					obj[el.name] = el.value;
				}

			} else if (el.checked) {
				obj[el.name] = "on";
			} else {
				obj[el.name] = "off";
			}

			return obj;
		},{});
}



// SUPPORT FUNCTIONS:
function checkValidityDates(){
	let validDates = true;

	let dates = [...arguments].forEach(dateInput=>{
		let date = toDate(dateInput.value);

		if (!date || isNaN(date.getTime())) {
			validDates = false;
			dateInput.setCustomValidity("Invalid date");
		} else {
			dateInput.setCustomValidity("");
		}
	});

	return validDates;
}
