const MES_NOMS=["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"];
const GET_PARAMS = (function(search){
	let params = {};
	if (search.length > 0) {
		params = search.substr(1).split("&")
			.reduce((params,p)=>{
				let [k,v] = p.split("=");

				if (v) {
					v = decodeURIComponent(v);
				}

				params[k] = v;
				return params;
			},{});
	}

	return params;
})(location.search);

const PARAMS = (function(data){
	if (data) {
		let lastChar = parseInt(data.substr(data.length-1));

		data = data.substr(0, data.length-1);

		while (lastChar --> 0) {
			data += "=";
		}
		
		return JSON.parse(atob(data));
	} else {
		return {};
	}

//})(GET_PARAMS['d']);
})(localStorage.getItem('d'));

function fromDate(date, short) {
	let month = date.getMonth()+1;
	let day = date.getDate();
	if (month < 10) month = "0"+month;
	if (day < 10) day = "0"+day;
	if (short) {
		return `${date.getFullYear()%2000}${month}${day}`;
	} else {
		return `${date.getFullYear()}-${month}-${day}`;
	}
}

function toDate(value) {
	let str = ""+value;
	if (str.length != 10 && str.length != 6) return undefined;

	if (str.length == 6) {
		return new Date(`20${str.substr(0,2)}-${str.substr(2,2)}-${str.substr(4)}`);
	} else {
		return new Date(`${str.substr(0,4)}-${str.substr(5,2)}-${str.substr(8)}`);
	}
}

function diffDays(i,f) {
	let diffTime = Math.abs(f.getTime() - i.getTime());
	let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	return diffDays;
}

function formatPrice(val, symbol) {
	let str = `${val}`;
	let dot = str.indexOf(".");

	if (dot >= 0) {
		while(str.length-dot < 3) {
			str += "0";
		}
	}
	if (symbol) {
		return str+" "+symbol;
	} else {
		
return str;
	}
}

function encData(data) {
	let text = btoa(JSON.stringify(data));

	if (text.endsWith("==")) {
		text = text.substr(0, text.length-2) + "2";
	} else if (text.endsWith("=")) {
		text = text.substr(0, text.length-1) + "1";
	} else {
		text = text + "0";
	}

	return text;
}

function addClass(element, className) {
	let classes = element.className.split(" ");
	if (classes.indexOf(className) < 0) {
		element.className += " "+className;
	}
}

function removeClass(element, className) {
	let classes = element.className.split(" ");
	let idx = classes.indexOf(className);
	if (idx >= 0) {
		classes.splice(idx, 1);
		element.className = classes.join(" ");
	}
}

function hasClass(element, className) {
	let classes = element.className.split(" ");
	return classes.indexOf(className) >= 0;
}

function cleanElement(el){
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

module.exports = {
	PARAMS: PARAMS,
	MES_NOMS: MES_NOMS,
	diffDays: diffDays,
	formatPrice: formatPrice,
	toDate: toDate,
	fromDate: fromDate,
	encData: encData,
	addClass: addClass,
	removeClass: removeClass,
	hasClass: hasClass,
	cleanElement: cleanElement,
	getElementById: id => document.getElementById(id),
}