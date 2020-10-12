const {PARAMS, MES_NOMS, toDate, fromDate, encData, addClass, removeClass, getElementById}  = require('./utils.js');

let initDate;
let endDate;

module.exports = {
	init: _=>{
		getElementById("back-button-footer").href = 
		getElementById("back-button").href = "./index.html";
	},
	load: _=>{
		initDate = toDate(PARAMS.ini);
		endDate = toDate(PARAMS.end);

		let endMonth = endDate.getMonth();
		let endYear = endDate.getYear();

		let date = new Date(initDate);
		while (date.getYear() < endYear || date.getMonth() <= endMonth) {
			cargarMes(date);
			date.setMonth(date.getMonth()+1);
			date.setDate(1);
		}

		document.querySelectorAll(".dow.visible input").forEach(e=>e.onblur=blurEvent);
	}
}

function cargarMes(date){
	date = new Date(date);
	let month = date.getMonth();
	let year = date.getFullYear();

	let temp = getElementById("month");
	let clon = temp.content.cloneNode(true);

	clon.querySelector(".month-name").textContent = MES_NOMS[month]+" "+year;

	cargarSetmanes(date, clon.querySelector("tbody"));

	getElementById("mesos").appendChild(clon);
}

function cargarSetmanes(date, mes){
	let thisMonth = date.getMonth();
	let week;

	while(date.getMonth() == thisMonth && date.getTime() < endDate.getTime()) {
		if (!week || date.getDay()==1){
			if (week) mes.appendChild(week)
			week = newWeek();
		}
		fillDay(week.querySelector(".d"+(date.getDay()+6)%7), date);
		date.setDate(date.getDate()+1);
	}
	mes.appendChild(week);
}

function newWeek(){
	let temp = getElementById("week");
	return temp.content.cloneNode(true);	
}

function fillDay(dayElement, date) {
	let def = usosDefault(date);
	let usos = getUsos(date);

	dayElement.querySelector(".dianum").textContent = date.getDate();
	dayElement.querySelector("input").value=usos;
	dayElement.setAttribute("date",fromDate(date));
	dayElement.setAttribute("def",def);

	if (def == usos) {
		dayElement.className += " visible def";

	} else {
		dayElement.className += " visible";
		addResetButton(dayElement);
	}
}

function getUsos(date){
	let usos;
	if (PARAMS.exceptions) {
		usos = PARAMS.exceptions[fromDate(date,true)];
	}
	if (usos === undefined) {
		usos = usosDefault(date);
	}
	return usos;
}

function usosDefault(date) {
	return PARAMS.dia[(date.getDay()+6)%7];
}

function blurEvent(ev) {
	let td = ev.target.parentNode.parentNode;
	let def = td.getAttribute("def");
	let usos = ev.target.value;
	save();
	if (def == usos) {
		addClass(td, "def");
		removeResetButton(td);
	} else {
		removeClass(td, "def");
		addResetButton(td);
	}
}

function addResetButton(td) {
	let div = td.children[0];
	if (!td.buttonReset) {
		let button = document.createElement("button");
		button.innerHTML = "×";
		button.onclick = ev => {
			td.querySelector("input").value = td.getAttribute("def");
			save();
			addClass(td, "def");
			removeResetButton(td);
		}
		div.appendChild(button);
		td.buttonReset = button;
	}
}

function removeResetButton(td) {
	let div = td.children[0];
	if (td.buttonReset) {
		div.removeChild(td.buttonReset);
		td.buttonReset = undefined;
	}
}

function save(){
	dows = [...document.querySelectorAll(".dow.visible")]
		.map(d=> [toDate(d.getAttribute("date")), d.querySelector("input").value])
		.filter(([date, value])=> PARAMS.dia[(date.getDay()+6)%7] != value)
		.reduce((obj,[date, value])=>{
			obj[fromDate(date,true)] = value;
			return obj;
		},{});

	PARAMS.exceptions = dows;

	localStorage.setItem("d", encData(PARAMS))
}