const test = ["FBFBBFFRLR", "BFFFBBFRRR", "FFFBBBFRRR", "BBFFBBFRLL"];
// const input = test;
const dayFive = {
	legend: {
		'F': 'lower',
		'L': 'lower',
		'B': 'upper',
		'R': 'upper'
	},
	highestSeatId: -1,
	maxRows: 128,
	currentRow: [],
	currentSeat: [],
	allSeats: [],
	preProcess(boardingPass) {
		this.firstSeven = boardingPass.substr(0, 7);
		this.lastChars = boardingPass.substr(7, boardingPass.length - 1)
		this.currentRow = this.createRangeArray(0, 127);
		this.currentSeat = this.createRangeArray(0, 7);
	},
	createRangeArray(from, to) {
		let nArr = [];
		for (let i = from; i <= to; i++) {
			nArr.push(i)
		}
		return nArr;
	},
	getSource(source) {
		return (source === 1) ? this.currentRow : (source === 2) ? this.currentSeat : null;
	},
	setSource(source, value) {
		(source === 1) ? this.currentRow = value : (source === 2) ? this.currentSeat = value : null;
	},
	lower(source) {
		let from = this.getSource(source)[0], to = this.getSource(source)[this.getSource(source).length / 2 - 1];
		this.setSource(source, this.createRangeArray(from, to))
	},
	upper(source) {
		let from = this.getSource(source)[this.getSource(source).length / 2], to = this.getSource(source)[this.getSource(source).length - 1];
		this.setSource(source, this.createRangeArray(from, to))
	},
	evalValue(char, source) {
		const mode = (this.legend.hasOwnProperty(char)) ? this.legend[char] : !1;
		if (!mode || !this.hasOwnProperty(mode)) { return null; }
		this[mode](source);
	},
	getRow() {
		for (let i = 0; i < this.firstSeven.length; i++) {
			const char = this.firstSeven.charAt(i);
			this.evalValue(char, 1);
			// console.log(`processing: ${char}. nums are: ${this.currentRow[0]} and ${this.currentRow[this.currentRow.length - 1]}`)
			// if (i == 3) { break }
		}
		if (this.currentRow.length === 1) {
			this.currentRow = this.currentRow[0]
		} else {
			console.log(this.currentRow)
			throw new Error('something with input data went wrong!');
		}
	},
	getSeat() {
		for (let i = 0; i < this.lastChars.length; i++) {
			const char = this.lastChars.charAt(i);
			this.evalValue(char, 2)
			// console.log(char);
		}
		if (this.currentSeat.length === 1) {
			this.currentSeat = this.currentSeat[0];
		} else {
			console.log(this.currentSeat)
			throw new Error("something went wrong with generating Seat")
		}
	},
	getUniqueSeatId() {
		this.seatId = (this.currentRow * 8 + this.currentSeat);
	},
	runner(boardingPass) {
		this.preProcess(boardingPass);
		this.getRow();
		this.getSeat();
		this.getUniqueSeatId();
		this.allSeats.push(this.seatId);
		(this.seatId > this.highestSeatId) ? this.highestSeatId = this.seatId : !1;
	},
	checkRange(a, b, c) {
		if ((a + 2) === b) {
			return b - 1;
		}
		return !1;
	},
	getMySeat() {
		const sorted = this.allSeats.sort(function (a, b) { return a - b });
		const max = sorted.length - 1;
		for (let i = 0; i < sorted.length; i++) {
			let first = i;
			let middle = i + 1;
			let last = i + 2;
			let isMySeat = this.checkRange(sorted[first], sorted[middle])
			if (isMySeat) {
				this.mySeatId = isMySeat;
				break;
			}
			if (last > max) {
				throw new Error('cant find my seat, fuck!!!');
			}
		}

	}
};
module.exports.DayFive = function DayFive(reader) {
	let rawData = reader("dayfive.txt");
	const input = rawData.split("\n");
	for (const seat of input) {
		dayFive.runner(seat);
	}
	// console.log(`day five part one: ${dayFive.highestSeatId}`)
	dayFive.getMySeat()
	console.log(`day five part two, my seat, is: ${dayFive.mySeatId}`);
}



