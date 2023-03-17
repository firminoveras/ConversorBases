// Quanto maior esse número, mais precisão o cálculo float terá
const LIMIT_FLOAT_NUMBERS = 10

const LAST_BASE_IN = 0
const LAST_BASE_OUT = 1

const ALERT_ERROR = 0
const ALERT_SUCESS = 1
const ALERT_GENERIC = 3

let inBase = 2
let outBase = 10
let lastBase = LAST_BASE_IN;

function validBase(base) {
	return base >= 2 && base <= 36 && /^[0-9]{1,2}$/.test(base)
}

function showMessage(alertType, text) {
	let messageOutput = document.getElementById('errorText');
	switch (alertType) {
		case ALERT_ERROR:
			messageOutput.style.backgroundColor = '#e25b5b'
			break;
		case ALERT_SUCESS:
			messageOutput.style.backgroundColor = '#22AA22'
			break;
		default:
			messageOutput.style.backgroundColor = '#222222'
			break;
	}
	errorText.innerHTML = text
	errorText.classList.add('show');
	setTimeout(function () {
		errorText.classList.remove('show');
	}, 3000);
}

function convertToDec(num, base) {
	num = num.toString().toUpperCase();
	if (!validBase(base)) throw new Error("Base não suportada!");
	let exp = -1;
	let result = 0.0;

	if (num.includes('.')) {
		fracNumber = num.split('.')[1]
		num = num.split('.')[0]
		for (var i = 0; i < fracNumber.length; i++) {
			let number;
			if (fracNumber.charCodeAt(i) >= 48 && fracNumber.charCodeAt(i) < 48 + Math.min(base, 10))
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
		if (num.charCodeAt(i) >= 48 && num.charCodeAt(i) < 48 + Math.min(base, 10))
			number = Number(num[i]);
		else if (num.charCodeAt(i) >= 65 && num.charCodeAt(i) < (55 + base) && base > 10)
			number = (num.charCodeAt(i)) - 55;
		else throw new Error("Algarismo inválido!");
		result += number * (base ** exp);
		exp++;
	}
	return result;
}

function convertFromDec(num, base) {
	num = num.toString().toUpperCase();
	let out = ""
	let fracResults = []
	let isFloat = false
	if (!validBase(base)) throw new Error("Base não suportada!")
	if (num.includes('.')) {
		isFloat = true
		fracNumber = parseFloat('0.' + num.split('.')[1])
		num = num.split('.')[0]
		let iterations = 0
		while (fracNumber * base != 0.0 && iterations < LIMIT_FLOAT_NUMBERS) {
			let n = fracNumber * base
			fracResults.push(Math.floor(n))
			fracNumber = n - Math.floor(n)
			iterations++;
		}
	}
	let n = Number(num)
	let results = []
	while (n > 0) {
		let quociente = Math.floor(n / base)
		let resto = n % base;
		n = quociente
		results.push(resto)
	}
	for (var i = results.length - 1; i >= 0; i--) {
		r = results[i]
		if (Number(r) > 9)
			r = String.fromCharCode(55 + r)
		out += r
	}
	if (isFloat) {
		out += ".";
		for (var i = 0; i < fracResults.length; i++) {
			r = fracResults[i]
			if (Number(r) > 9)
				r = String.fromCharCode(55 + r)
			out += r
		}
	}
	return out
}

function convert(input, inputBase, outputBase) {
	if (inputBase != outputBase) return convertFromDec(convertToDec(input, inputBase), outputBase)
	else return input
}

function updateConversion() {
	setBaseSelectorVisible(false)
	let text = document.getElementById('numberInput').value
	document.getElementById('numberOutput').value = ''
	if (text.length > 0) {
		try {
			text = convert(text, inBase, outBase)
			document.getElementById('numberOutput').value = text
		} catch (error) {
			showMessage(ALERT_ERROR, error.message)
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
	if (validBase(base)) {
		if (lastBase == LAST_BASE_IN) {
			document.getElementById('inChangeButton').innerHTML = base.toString()
			inBase = base
		} else {
			document.getElementById('outChangeButton').innerHTML = base.toString()
			outBase = base
		}
		updateConversion();
	}
}

function setBaseSelectorVisible(visibility) {
	if (visibility) document.getElementById('inDiv').classList.add('open')
	else document.getElementById('inDiv').classList.remove('open')
}

function getIsBaseSelectorVisible() {
	return document.getElementById('inDiv').classList.contains('open')
}


(function (window, document, undefined) {
	window.onload = init;
	function init() {
		document.getElementById('inChangeButton').addEventListener('click', () => {
			if (getIsBaseSelectorVisible() && lastBase == LAST_BASE_IN) setBaseSelectorVisible(false)
			else setBaseSelectorVisible(true)
			document.getElementById('arrowUp').style.visibility = 'visible'
			document.getElementById('arrowDown').style.visibility = 'hidden'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
			lastBase = LAST_BASE_IN;
		})

		document.getElementById('inChangeButton').addEventListener('wheel', event => {
			let delta = Math.sign(event.deltaY);
			lastBase = LAST_BASE_IN;
			updateBaseOfLastElement(Number(document.getElementById('inChangeButton').innerHTML) - (delta))
		})

		document.getElementById('outChangeButton').addEventListener('click', () => {
			if (getIsBaseSelectorVisible() && lastBase == LAST_BASE_OUT) setBaseSelectorVisible(false)
			else setBaseSelectorVisible(true)
			document.getElementById('arrowUp').style.visibility = 'hidden'
			document.getElementById('arrowDown').style.visibility = 'visible'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
			lastBase = LAST_BASE_OUT;
		})

		document.getElementById('outChangeButton').addEventListener('wheel', event => {
			let delta = Math.sign(event.deltaY);
			lastBase = LAST_BASE_OUT;
			updateBaseOfLastElement(Number(document.getElementById('outChangeButton').innerHTML) - (delta))
		})

		document.getElementById('numberInput').addEventListener('input', function (evt) { updateConversion(); })
		document.getElementById('baseSelector2').addEventListener('click', () => updateBaseOfLastElement(2))
		document.getElementById('baseSelector8').addEventListener('click', () => updateBaseOfLastElement(8))
		document.getElementById('baseSelector10').addEventListener('click', () => updateBaseOfLastElement(10))
		document.getElementById('baseSelector16').addEventListener('click', () => updateBaseOfLastElement(16))
		document.getElementById('baseSelectorCustom').addEventListener('keypress', function (evt) { if (evt.key == 'Enter') baseSelectorCustomApply() })


		document.getElementById('btPaste').addEventListener('click', () => {
			navigator.clipboard.readText().then(
				cliptext => {
					document.getElementById('numberInput').value = cliptext
					updateConversion()
				},
				err => {
					showMessage(ALERT_ERROR, "Permissão para usar a Área de Transferência negada. Os botões de copiar e colar ficarão indisponíves.")
					document.getElementById('btPaste').style.visibility = 'hidden'
					document.getElementById('btCopy').style.visibility = 'hidden'
				}
			);
		})

		document.getElementById('btCopy').addEventListener('click', () => {
			navigator.clipboard.writeText(document.getElementById('numberOutput').value).then(
				sucess => showMessage(ALERT_SUCESS, 'Resultado copiado!'),
				err => {
					showMessage(ALERT_ERROR, "Permissão para usar a Área de Transferência negada. Os botões de copiar e colar ficarão indisponíves.")
					document.getElementById('btPaste').style.visibility = 'hidden'
					document.getElementById('btCopy').style.visibility = 'hidden'
				}
			);
		})
	}
})(window, document, undefined);