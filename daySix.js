
const flattenArray = array => {
	let o = {};
	for (const e of array) {
		e.split("").forEach(v => {
			o[v] = true;
		})
	}
	return Object.keys(o);
};
const parseGroup = array => {
	let o = {}, num = 1;

	for (let row of array) {
		if (row.trim().length === 0) {
			++num;
		} else {
			if (!o.hasOwnProperty(num)) { o[num] = []; }
			row = row.replace(/\r/, '')
			o[num].push(row);
		}
	}
	for (let key in o) {
		o[key] = flattenArray(o[key])
	}
	return o;
};
const calcCount = array => {
	return array.reduce((a, b) => a + b, 0);
};


module.exports.DaySix = function DaySix(reader) {
	// const input = reader("daySixTest.txt");
	const input = reader("daySix.txt");
	const formattedGroups = parseGroup(input.split("\n"))
	let n = 0;
	for (const group in formattedGroups) {
		n += formattedGroups[group].length;
	}

	console.log(n);


}