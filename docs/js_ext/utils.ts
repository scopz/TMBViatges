import { ParamsModel } from "./models";

const PRE_BASE64 = 'eyJ';
const POST_BASE64 = '=';
const POST_BASE64_2 = POST_BASE64+POST_BASE64;

const GET_PARAMS = (search => search.length == 0 
	? {}
	: search.substring(1).split('&')
			.reduce((acc, param) => {
				const [key, value] = param.split('=');

				acc[key] = value ? decodeURIComponent(value) : '';
				return acc;
			}, {} as Record<string, string>)
)(location.search);

export const PARAMS: ParamsModel = (data => {
	if (data) {
		let lastChar = parseInt(data.substring(data.length-1));
		const firstChar = parseInt(data.substring(0,1));

		data = data.substr(1, data.length-2);

		while (lastChar --> 0) {
			data += POST_BASE64;
		}

		if (firstChar) {
			data = PRE_BASE64 + data;
		}

		return JSON.parse(atob(data));
	} else {
		return {};
	}

})(GET_PARAMS.d);

export const MES_NOMS = ['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];

export function fromDate(date: Date, short: boolean = false): string {
	let month: number | string = date.getMonth()+1;
	let day: number | string = date.getDate();

	if (month < 10) month = '0'+month;
	if (day < 10) day = '0'+day;

	return short
		? `${date.getFullYear()%2000}${month}${day}`
		: `${date.getFullYear()}-${month}-${day}`;
}

export function toDate(value: any): Date {
	const str = ''+value;
	if (str.length != 10 && str.length != 6) throw new Error(`Wrong date format ${value}`);

	return str.length == 6
		? new Date(`20${str.substr(0,2)}-${str.substr(2,2)}-${str.substr(4)}`)
		: new Date(`${str.substr(0,4)}-${str.substr(5,2)}-${str.substr(8)}`);
}

export function diffDays(i: Date | string,f: Date | string): number {
	if (!(i instanceof Date)) i = new Date(i);
	if (!(f instanceof Date)) f = new Date(f);

	const diffTime = Math.abs(f.getTime() - i.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

export function formatPrice(val: number | string, symbol: string = ''): string {
	let str = `${val}`;
	let dot = str.indexOf('.');

	if (dot >= 0) {
		while(str.length-dot < 3) {
			str += '0';
		}
	}

	return symbol
		? `${str} ${symbol}`
		: str;
}

export function encData(data: ParamsModel): string {
	let text = btoa(JSON.stringify(data));

	if (text.endsWith(POST_BASE64_2)) {
		text = text.substring(0, text.length-2) + 2;
	} else if (text.endsWith(POST_BASE64)) {
		text = text.substring(0, text.length-1) + 1;
	} else {
		text = text + 0;
	}

	if (text.startsWith(PRE_BASE64)) {
		text = ((new Date().getTime() % 9)+1) + text.substring(3);
	} else {
		text = 0 + text;
	}

	return text;
}

export function goToPage(page?: string, d = GET_PARAMS.d) {
	location.href = (page? `./${page}.html` : './' ) + '?d='+d;
}