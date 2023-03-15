const LAST_BASE_IN = 0
const LAST_BASE_OUT = 1

let inBase = 2
let outBase = 10
let lastBase = LAST_BASE_IN;

function convertToDec(num, base) {
	num = num.toString()
	if (base == 10) return num
	num = num.toUpperCase();
	if (base < 2 || base > 35) throw new Error("Base não suportada!");
	let exp = 0;
	let result = 0;
	for (var i = num.length - 1; i >= 0; i--) {
		let number;
		if (num.charCodeAt(i) >= 48 && num.charCodeAt(i) < 48 + base)
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
	if (base < 2 || base > 35) throw new Error("Base não suportada!");
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



(function (window, document, undefined) {
	window.onload = init;
	function init() {


		document.getElementById('numberInput').addEventListener('input', function (evt) {
			updateConversion();
		})

		document.getElementById('inChangeButton').addEventListener('click', () => {
			lastBase = LAST_BASE_IN;
			document.getElementById('arrowUp').style.visibility = 'visible'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
			document.getElementById('arrowDown').style.visibility = 'hidden'
		})

		document.getElementById('outChangeButton').addEventListener('click', () => {
			lastBase = LAST_BASE_OUT;
			document.getElementById('arrowUp').style.visibility = 'hidden'
			document.getElementById('arrowDown').style.visibility = 'visible'
			document.getElementById('backgroundSelectorDiv').style.visibility = 'visible'
		})

		document.getElementById('baseSelector2').addEventListener('click', () => {
			if (lastBase == LAST_BASE_IN) {
				document.getElementById('inChangeButton').innerHTML = '2'
				inBase = 2
			} else {
				document.getElementById('outChangeButton').innerHTML = '2'
				outBase = 2
			}
			updateConversion();
		})
		document.getElementById('baseSelector8').addEventListener('click', () => {
			if (lastBase == LAST_BASE_IN) {
				document.getElementById('inChangeButton').innerHTML = '8'
				inBase = 8
			} else {
				document.getElementById('outChangeButton').innerHTML = '8'
				outBase = 8
			}
			updateConversion();
		})
		document.getElementById('baseSelector10').addEventListener('click', () => {
			if (lastBase == LAST_BASE_IN) {
				document.getElementById('inChangeButton').innerHTML = '10'
				inBase = 10
			} else {
				document.getElementById('outChangeButton').innerHTML = '10'
				outBase = 10
			}
			updateConversion();
		})
		document.getElementById('baseSelector16').addEventListener('click', () => {
			if (lastBase == LAST_BASE_IN) {
				document.getElementById('inChangeButton').innerHTML = '16'
				inBase = 16
			} else {
				document.getElementById('outChangeButton').innerHTML = '16'
				outBase = 16
			}
			updateConversion();
		})

		document.getElementById('baseSelectorCustom').addEventListener('input', function (evt) {

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
			} else {

			}
		})
	}
})(window, document, undefined);

