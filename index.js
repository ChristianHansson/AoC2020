const path = require("path"), fs = require("fs");
const reader = function reader() {
	if (!arguments[0]) { throw new Error("no arguemnts to reader function"); }
	const file = path.join(__dirname, "puzzles", arguments[0]);
	if (fs.existsSync(file)) {
		return fs.readFileSync(file).toString();
	}
	return !1;
};
const loader = function () {
	return {
		DayFive() {
			require("./five").DayFive(reader);
		}
	}
}

console.clear();
loader().DayFive();