const calculator = document.querySelector('.calculator')
let history = []
let tempNumber = ''
let operationType = ''
let isPercent = false
let isEqual = false

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
		isEqual = false
		isPercent = true
		if (history.length > 1) {
			tempNumber = calculate(history, isPercent, isEqual)
		} else {
			tempNumber = tempNumber / 100
		}
	} else if (data === '=') {
		if (!isPercent) {
			history.push(tempNumber)
		}
		isEqual = true
		tempNumber = calculate(history, isPercent, isEqual)
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

// Подсчет конечного значения
function calculate(historyArray, isPercent, isEqual) {
	let total = 0
	historyArray.forEach((item, idx) => {
		// console.log(item, idx)
		// console.log(total)
		item = parseFloat(item)
		if (idx === 0) {
			total = item
		} else if (idx - 2 >= 0) {
			const prevItem = historyArray[idx - 1]
			if (item >= 0) {
				if (prevItem === '+') {
					total = total + item
				} else if (prevItem === '-') {
					total = total - item
				} else if (prevItem === '*') {
					total = total * item
				} else if (prevItem === '/') {
					total = total / item
				} else if (prevItem === '%') {
					total = (total / 100) * item
				}
			}
		}

		if (isPercent) {
			const x = total
			const operation = historyArray[idx - 1]
			const n = parseFloat(tempNumber)
			total = calculatePercent(x, n)
		}
		// if (historyArray.length) {
		// 	console.log(historyArray.length)
		// 	console.log(historyArray)
		// }
	})
	return String(total)
}

// Пересчёт процента, когда нажат процент
function calculatePercent(x, n) {
	console.log(x, n)
	let total = x * (n / 100)
	isPercent = false
	return total
}

// Пересчёт процента, когда нажали равно, после нажатия процента
// function calculatePercentWhenPushEqual(x, operation, n) {
// 	let total = 0
// 	if (operation === '+') {
// 		total = x + (n / 100) * x
// 	} else if (operation === '-') {
// 		total = x - (n / 100) * x
// 	} else if (operation === '*') {
// 		total = x * (n / 100)
// 	} else if (operation === '/') {
// 		total = x / (n / 100)
// 	}
// 	return total
// }

// Логика просчета процентов на калькуляторе
// x - число слева
// n - число справа

/* Сложение */
// Нажали процент
// x * (n / 100) // 10 + 10 => 10 * (10 / 100) = 1
// Нажали процент, затем равно
// x + (n / 100) * x // 10 + 10 => 10 + (10 / 100 * 10) = 11

/* Вычитание */
// Нажали процент
// x * (n / 100) // 10 - 10 => 10 * (10 / 100) = 1
// Нажали процент, затем равно
// x - (n / 100) * x // 10 - 10 => 10 - (10 / 100 * 10 = 9

/* Умножение */
// Нажали процент
// n / 100 // 10 * 10 => 10 / 100 = 0,1
// Нажали процент, затем равно
// x * (n / 100) // 10 * 10 => 10 * (10 / 100) = 1

/* Деление */
// Нажали процент
// n / 100 // 10 / 10 => 10 / 100 = 0,1
// Нажали процент, затем равно
// x / (n / 100) // 10 / (10 / 100) = 1
