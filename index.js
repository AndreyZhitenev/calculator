const calculator = document.querySelector('.calculator')
let history = []
let tempNumber = ''
let operationType = ''
let isPercent = false

calculator.addEventListener('click', event => {
	const target = event.target
	if (target.classList.contains('calculator__col')) {
		const data = target.dataset.type
		operationTypeHandling(data)
		renderTotal(tempNumber)
		renderHistory(history)
	}
})

// Обработка нажатых клавиш на калькуляторе
function operationTypeHandling(data) {
	let stringMath = history.toString().replace(/,/g, '')
	if (data >= 0) {
		operationType = 'number'
		tempNumber = tempNumber === '0' ? data : tempNumber + data
	} else if (data === 'float') {
		operationType = data
		if (!/\./.test(tempNumber)) {
			if (tempNumber) {
				tempNumber = tempNumber + '.'
			} else {
				tempNumber = '0.'
			}
		}
	} else if (data === 'delete' && operationType === 'number') {
		tempNumber = tempNumber.substring(0, tempNumber.length - 1)
		tempNumber = tempNumber ? tempNumber : '0'
		isPercent = false
	} else if (['+', '-', '/', '*'].includes(data) && tempNumber) {
		operationType = data
		history.push(tempNumber, operationType)
		tempNumber = ''
		isPercent = false
	} else if (data === 'clear') {
		history = []
		tempNumber = '0'
		isPercent = false
	} else if (data === '%') {
		isPercent = true
		if (history.length > 1) {
			stringMath = stringMath.substring(0, stringMath.length - 1)
			tempNumber = calculate(parseCalculationString(stringMath), isPercent)
		} else {
			tempNumber = tempNumber / 100
		}
	} else if (data === '=') {
		if (!isPercent) {
			history.push(tempNumber)
		}
		stringMath = stringMath + tempNumber
		tempNumber = calculate(parseCalculationString(stringMath), isPercent)
		history = []
		isPercent = false
	}
}

// Отрисовка текущего значения на экране калькулятора
function renderTotal(value) {
	const totalBlock = calculator.querySelector('.calculator__total')
	totalBlock.innerHTML = value
}

// Формирование HTML-кода и вывода блока истории операций
function renderHistory(historyArray) {
	const historyBlock = calculator.querySelector('.calculator__history')
	let htmlElements = ''
	historyArray.forEach(item => {
		if (item >= 0) {
			htmlElements = htmlElements + `&nbsp;<span>${item}</span>`
		} else if (['+', '-', '/', '*', '%'].includes(item)) {
			item = item === '*' ? '×' : item === '/' ? '÷' : item
			htmlElements = htmlElements + `&nbsp;<strong>${item}</strong>`
		}
	})
	historyBlock.innerHTML = htmlElements
}

// Перевод введённого выражения в строку
function parseCalculationString(s) {
	let calculation = [],
		current = ''
	for (let i = 0, ch; (ch = s.charAt(i)); i++) {
		if ('*/+-'.indexOf(ch) > -1) {
			if (current == '' && ch == '-') {
				current = '-'
			} else {
				calculation.push(parseFloat(current), ch)
				current = ''
			}
		} else {
			current += s.charAt(i)
		}
	}
	if (current != '') {
		calculation.push(parseFloat(current))
	}
	return calculation
}

// Подсчет конечного значения
function calculate(calc, isPercent) {
	let total
	let ops = [
			{ '*': (a, b) => a * b, '/': (a, b) => a / b },
			{ '+': (a, b) => a + b, '-': (a, b) => a - b },
		],
		newCalc = [],
		currentOp
	for (let i = 0; i < ops.length; i++) {
		for (let j = 0; j < calc.length; j++) {
			if (ops[i][calc[j]]) {
				currentOp = ops[i][calc[j]]
			} else if (currentOp) {
				newCalc[newCalc.length - 1] = currentOp(
					newCalc[newCalc.length - 1],
					calc[j]
				)
				currentOp = null
			} else {
				newCalc.push(calc[j])
			}
		}
		calc = newCalc
		newCalc = []
	}
	if (calc.length > 1) {
		console.log('Ошибка: невозможно решить выражение')
		return calc
	} else {
		if (isPercent) {
			const x = calc[0]
			const n = parseFloat(tempNumber)
			total = calculatePercent(x, n)
			return checkZeros(String(total))
		} else {
			return checkZeros(String(calc[0]))
		}
	}
}

// Пересчёт процента, когда нажат процент
function calculatePercent(x, n) {
	isPercent = false
	return x * (n / 100)
}

// Посчитать кол-во нулей после точки и удалить, если их много
function checkZeros(calc) {
	let afterDot = calc.split('.')
	if (String(afterDot[1]).split('0').length - 1 > 3) {
		return (
			String(afterDot[0]) +
			'.' +
			String(afterDot[1]).substring(0, afterDot[1].indexOf('0'))
		)
	} else {
		return calc
	}
}
