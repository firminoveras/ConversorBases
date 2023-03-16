const LAST_BASE_IN = 0
const LAST_BASE_OUT = 1

let inBase = 2
let outBase = 10
let lastBase = LAST_BASE_IN;

function validBase(base){
	return base >= 2 && base <= 36 && /^[0-9]{1,2}$/.test(base)
}

function convertToDec(num, base) {
	num = num.toString()
	num = num.toUpperCase();
	if (!validBase(base)) throw new Error("Base não suportada!");
	let exp;
	let result = 0.0;

	if (num.includes('.')) {
		fracNumber = num.split('.')[1]
		num = num.split('.')[0]
		exp = -1;
		for (var i = 0; i < fracNumber.length; i++) {
			let number;
			if (fracNumber.charCodeAt(i) >= 48 && fracNumber.charCodeAt(i) < 48 + Math.min(base,9))
				number = Number(fracNumber[i]);
			else if (fracNumber.charCodeAt(i) >= 65 && fracNumber.charCodeAt(i) < (55 + base) && base > 10)
				number = (fracNumber.charCodeAt(i)) - 55;
			else throw new Error("Algarismo inválido!");
			result += number * (base ** exp);
			exp--;
		}
	}
	exp = 0;
	for (var i = num.length - 1; i >= 0; i--) {
		let number;
		if (num.charCodeAt(i) >= 48 && num.charCodeAt(i) < 48 + Math.min(base,9))
			number = Number(num[i]);
		else if (num.charCodeAt(i) >= 65 && num.charCodeAt(i) < (55 + base) && base > 10){

			number = (num.charCodeAt(i)) - 55;
		}
		else throw new Error("Algarismo inválido!");
		result += number * (base ** exp);
		//console.log(number+"x"+base+"^"+exp);
		exp++;
	}
	return result;
}

function convertFromDec(num, base) {
	if (base == 10) return num
	if (!validBase(base)) throw new Error("Base não suportada!");
	let n = Number(num)
	let results = [];
	while (n > 0) {
		let quociente = Math.floor(n / base);
		let resto = n % base;
		n = quociente;
		results.push(resto)
	}
	let out = "";
	for (var i = results.length - 1; i >= 0; i--) {
		r = results[i]
		if (Number(r) > 9)
			r = String.fromCharCode(55 + r)
		out += r;
	}

	return out;
}

function convert(input, inputBase, outputBase) {
	return convertFromDec(convertToDec(input, inputBase), outputBase)
}

function updateConversion() {
	setBaseSelectorVisible(false)
	let text = document.getElementById('numberInput').value
	document.getElementById('numberOutput').style.fontSize = '40px'
	document.getElementById('numberOutput').value = ''
	if (text.length > 0) {
		try {
			text = convert(text, inBase, outBase)
			document.getElementById('numberOutput').value = text
		} catch (error) {
			document.getElementById('numberOutput').style.fontSize = '20px'
			document.getElementById('numberOutput').value = error.message
		}
	}
}

function baseSelectorCustomApply() {
	let text = document.getElementById('baseSelectorCustom').value
	if (text.length > 0) {
		if (lastBase == LAST_BASE_IN) {
			document.getElementById('inChangeButton').innerHTML = text
			inBase = Number(text)
		} else {
			document.getElementById('outChangeButton').innerHTML = text
			outBase = Number(text)
		}
		updateConversion();
	}
}

function updateBaseOfLastElement(base) {
	if (lastBase == LAST_BASE_IN) {
		document.getElementById('inChangeButton').innerHTML = base.toString()
		inBase = base
	} else {
		document.getElementById('outChangeButton').innerHTML = base.toString()
		outBase = base
	}
	updateConversion();
}

function setBaseSelectorVisible(visibility) {
	if (visibility)
		document.getElementById('inDiv').classList.add('open')
	else
		document.getElementById('inDiv').classList.remove('open')

}

(function (window, document, undefined) {
	window.onload = init;
	function init() {
		document.getElementById('inChangeButton').addEventListener('click', () => {
			document.getElementById('inDiv').classList.toggle('open')
			lastBase = LAST_BASE_IN;
			document.getElementById('arrowUp').style.visibility = 'visible'
			document.getElementById('arrowDown').style.visibility = 'hidden'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
		})

		document.getElementById('outChangeButton').addEventListener('click', () => {
			document.getElementById('inDiv').classList.toggle('open')
			lastBase = LAST_BASE_OUT;
			document.getElementById('arrowUp').style.visibility = 'hidden'
			document.getElementById('arrowDown').style.visibility = 'visible'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
		})

		document.getElementById('numberInput').addEventListener('input', function (evt) { updateConversion(); })

		document.getElementById('baseSelector2').addEventListener('click', () => updateBaseOfLastElement(2))
		document.getElementById('baseSelector8').addEventListener('click', () => updateBaseOfLastElement(8))
		document.getElementById('baseSelector10').addEventListener('click', () => updateBaseOfLastElement(10))
		document.getElementById('baseSelector16').addEventListener('click', () => updateBaseOfLastElement(16))

		document.getElementById('baseSelectorCustom').addEventListener('keypress', function (evt) { if (evt.key == 'Enter') baseSelectorCustomApply() })
	}
})(window, document, undefined);

