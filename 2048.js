// Filename: script.js 
// Get the game grid 
const gridItems = [ 
	...document.querySelectorAll(".grid-item"), 
]; 
const score_val = document.querySelector(".score-value"); 
const result = document.querySelector(".result"); 
let score = 0; 
let moves = 0; 
let moveFactor = 4; 
let options = [ 
	2, 4, 8, 2, 4, 8, 2, 2, 4, 4, 2, 8, 2, 2, 4, 4, 2, 
]; 
let matrix = []; 
let prevMatrix; 

let colors = [ 
	"#caf0f8", 
	"#90e0ef", 
	"#00b4d8", 
	"#0077b6", 
	"#03045e", 
	"#023047", 
	"#fca311", 
	"#14213d", 
	"#e63946", 
	"#ffc300", 
	"#6a040f", 
	"#000000", 
]; 

// Create the starting game grid. 
let row = []; 
for (let index = 1; index < gridItems.length + 1; index++) { 
	if (index % 4 === 0) { 
		let item = gridItems[index - 1]; 
		item.firstElementChild.innerText = ""; 
		row.push(item); 
		matrix.push(row); 
		row = []; 
	} else { 
		let item = gridItems[index - 1]; 
		item.firstElementChild.innerText = ""; 
		row.push(item); 
	} 
} 

// Assign any two grid blocks the value of 2 
const rowIdx = Math.floor(Math.random() * 4); 
const colIdx = Math.floor(Math.random() * 4); 
let rowIdx2 = Math.floor(Math.random() * 4); 
let colIdx2 = Math.floor(Math.random() * 4); 

if (rowIdx === rowIdx2 && colIdx === colIdx2) { 
	rowIdx2 = Math.floor(Math.random() * 4); 
	colIdx2 = Math.floor(Math.random() * 4); 
} 

matrix[rowIdx][colIdx].firstElementChild.textContent = 2; 
matrix[rowIdx2][colIdx2].firstElementChild.textContent = 2; 

let availIndexes = updateAvailIndexes(); 

updateColors(); 

// Make web page able to listen to keydown event 
document.addEventListener("keydown", moveBlocks); 

// Method to extract columns from an 2D array. 
const arrayColumn = (arr, n) => arr.map((x) => x[n]); 

function moveBlocks(e) { 
	if ( 
		e.key !== "ArrowLeft" && 
		e.key !== "ArrowRight" && 
		e.key !== "ArrowUp" && 
		e.key !== "ArrowDown"
	) { 
		return; 
	} 

	moves++; 
	matrixVals = getCurrentMatrixValues(); 
	prevMatrix = matrixVals; 

	let col1 = arrayColumn(matrix, 0); 
	let col2 = arrayColumn(matrix, 1); 
	let col3 = arrayColumn(matrix, 2); 
	let col4 = arrayColumn(matrix, 3); 
	let row1 = matrix[0]; 
	let row2 = matrix[1]; 
	let row3 = matrix[2]; 
	let row4 = matrix[3]; 

	if (e.key === "ArrowLeft") { 
		moveLeft(row1); 
		moveLeft(row2); 
		moveLeft(row3); 
		moveLeft(row4); 
	} 
	if (e.key === "ArrowRight") { 
		moveRight(row1); 
		moveRight(row2); 
		moveRight(row3); 
		moveRight(row4); 
	} 
	if (e.key === "ArrowUp") { 
		moveLeft(col1); 
		moveLeft(col2); 
		moveLeft(col3); 
		moveLeft(col4); 
	} 
	if (e.key === "ArrowDown") { 
		moveRight(col1); 
		moveRight(col2); 
		moveRight(col3); 
		moveRight(col4); 
	} 

	matrixVals = getCurrentMatrixValues(); 
	availIndexes = updateAvailIndexes(); 
	updateColors(); 

	let check = checkMatrixEquality(prevMatrix, matrixVals); 

	if (availIndexes.length === 0 && check === true) { 
		gameOver("loose"); 
	} 

	if (moves % moveFactor === 0) { 
		generateNewBlock(); 
	} 
} 

setInterval(() => { 
	availIndexes = updateAvailIndexes(); 
	generateNewBlock(); 
}, 8000); 

setTimeout(() => { 
	options.push(16); 
	setTimeout(() => { 
		options.push(16); 
		options.push(32); 
		setTimeout(() => { 
			options.push(16); 
			options.push(32); 
			options.push(64); 
		}, 40000); 
	}, 18000); 
}, 120000); 

function getCurrentMatrixValues() { 
	let gridItems = [ 
		...document.querySelectorAll(".grid-item"), 
	]; 
	let matrix_grid = []; 
	let row = []; 
	for ( 
		let index = 1; 
		index < gridItems.length + 1; 
		index++ 
	) { 
		if (index % 4 === 0) { 
			let item = gridItems[index - 1]; 
			row.push(item.firstElementChild.innerText); 
			matrix_grid.push(row); 
			row = []; 
		} else { 
			let item = gridItems[index - 1]; 
			row.push(item.firstElementChild.innerText); 
		} 
	} 
	return matrix_grid; 
} 

function shiftLeft(arr) { 
	for (let i = 0; i < 4; i++) { 
		for (let i = 1; i < 4; i++) { 
			let currElement = arr[i].firstElementChild; 
			let prevElement = arr[i - 1].firstElementChild; 
			if (prevElement.innerText == 0) { 
				prevElement.innerText = 
					currElement.innerText; 
				currElement.innerText = ""; 
			} 
		} 
	} 
} 

function shiftRight(arr) { 
	for (let i = 0; i < 4; i++) { 
		for (let i = 2; i >= 0; i--) { 
			let currElement = arr[i].firstElementChild; 
			let nextElement = arr[i + 1].firstElementChild; 
			if (nextElement.innerText == 0) { 
				nextElement.innerText = 
					currElement.innerText; 
				currElement.innerText = ""; 
			} 
		} 
	} 
} 

function moveRight(row) { 
	shiftRight(row); 

	for (let i = 2; i >= 0; i--) { 
		let currElement = row[i].firstElementChild; 
		let nextElement = row[i + 1].firstElementChild; 
		let val = parseInt(currElement.innerText); 
		let nextVal = parseInt(nextElement.innerText); 
		if (val === nextVal && val !== 0) { 
			let newVal = val + nextVal; 
			nextElement.innerText = newVal; 
			currElement.innerText = ""; 
			score = score + 2; 
			score_val.innerText = score; 
			if (newVal === 2048) { 
				gameOver("Win"); 
			} 
		} 
	} 

	shiftRight(row); 
} 

function moveLeft(row) { 
	shiftLeft(row); 

	for (let i = 1; i < 4; i++) { 
		let currElement = row[i].firstElementChild; 
		let prevElement = row[i - 1].firstElementChild; 
		let val = parseInt(currElement.innerText); 
		let prevVal = parseInt(prevElement.innerText); 
		if (val === prevVal && val !== 0) { 
			let newVal = val + prevVal; 
			prevElement.innerText = newVal; 
			currElement.innerText = ""; 
			score = score + 2; 
			score_val.innerText = score; 
			if (newVal === 2048) { 
				gameOver("Win"); 
			} 
		} 
	} 

	shiftLeft(row); 
} 

function updateAvailIndexes() { 
	matrixValues = getCurrentMatrixValues(); 
	let grid = []; 
	for (let i = 0; i < 4; i++) { 
		for (let j = 0; j < 4; j++) { 
			if (matrixValues[i][j] == "") { 
				grid.push([i, j]); 
			} 
		} 
	} 
	return grid; 
} 

function generateNewBlock() { 
	if (availIndexes.length !== 0) { 
		let randInt = Math.floor( 
			Math.random() * availIndexes.length 
		); 
		let coords = availIndexes[randInt]; 
		let randInt3 = Math.floor( 
			Math.random() * options.length 
		); 
		let ele = 
			matrix[coords[0]][coords[1]].firstElementChild; 
		ele.innerText = options[randInt3]; 
		updateColors(); 
	} 
} 

function checkMatrixEquality(mat1, mat2) { 
	for (let i = 0; i < 4; i++) { 
		for (let j = 0; j < 4; j++) { 
			if (mat1[i][j] !== mat2[i][j]) { 
				return false; 
			} 
		} 
	} 
	return true; 
} 

function gameOver(status) { 
	if (status === "Win") { 
		result.innerText = "You Won!!!"; 
		result.style.color = "rgb(78, 236, 144)"; 
	} else { 
		result.innerText = "You Loose!!!"; 
		result.style.color = "rgb(252, 51, 51)"; 
	} 
} 

function updateColors() { 
	for (let i = 0; i < 4; i++) { 
		for (let j = 0; j < 4; j++) { 
			let elem = matrix[i][j].firstElementChild; 
			if (elem.innerText == 0) { 
				elem.parentElement.style.backgroundColor = 
					colors[0]; 
				elem.style.color = "black"; 
			} else if (elem.innerText == 2) { 
				elem.style.color = "black"; 
				elem.parentElement.style.backgroundColor = 
					colors[1]; 
			} else if (elem.innerText == 4) { 
				elem.style.color = "black"; 
				elem.parentElement.style.backgroundColor = 
					colors[2]; 
			} else if (elem.innerText == 8) { 
				elem.style.color = "black"; 
				elem.parentElement.style.backgroundColor = 
					colors[3]; 
			} else if (elem.innerText == 16) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[4]; 
			} else if (elem.innerText == 32) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[5]; 
			} else if (elem.innerText == 64) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[6]; 
			} else if (elem.innerText == 128) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[7]; 
			} else if (elem.innerText == 256) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[8]; 
			} else if (elem.innerText == 512) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[9]; 
			} else if (elem.innerText == 1024) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[10]; 
			} else if (elem.innerText == 2048) { 
				elem.style.color = "white"; 
				elem.parentElement.style.backgroundColor = 
					colors[11]; 
			} 
		} 
	} 
} 
