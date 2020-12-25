
const flattenArray = array => {
	let o = {};
	for (const e of array) {
		e.split("").forEach(v => {
			o[v] = true;
		})
	}
	return Object.keys(o);
};
const parseGroup = (array, flatten) => {
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
	if (!flatten) { return o; }
	for (let key in o) {
		o[key] = flattenArray(o[key])
	}
	return o;
};
const calcCount = array => {
	return array.reduce((a, b) => a + b, 0);
};
const objectifyArray = array => {
	let o = {}, num = 1;
	for (const person of array) {
		const thisKey = `person_${num}`;
		o[thisKey] = {}
		person.split("").forEach(a => {
			o[thisKey][a] = true
		})
		++num;
	}
	return o
}
const compareGroup = group => {
	console.log(group)
	for (let i = 0; i < group.length; i++) {
		console.log(i, group[i], group[i].includes("a"))
	}
	return 1
}
const calcGroupPartTwo = group => {
	// console.log(group, "\n")
	let personCount = Object.keys(group).length;
	if (personCount === 1) {
		/* assume if count is 1; key is called person_1 */
		return Object.keys(group['person_1']).length
	} else {
		let legend = {}
		for (const person in group) {
			// console.log(group[person])
			// legend[person] = Object.keys(group[person])
			// legend.push(Object.keys(group[person]))

			for (const a of Object.keys(group[person])) {
				// console.log(a);
				(legend.hasOwnProperty(a)) ? legend[a]++ : legend[a] = 0;
			}

			// console.log(Object.keys(group[person]))
		}
		// console.log(legend)
		let num = 0;
		for (const leg in legend) {
			if (legend[leg] > 0) {
				num++;
			}
		}
		return num;
		// console.log(compareGroup(legend))
	}
	console.log("\n")
	return 0;
}
const getLetterObject = () => {
	let s = "abcdefghijklmnopqrstuvwxyz".split("");
	let o = {}
	for (const l of s) {
		o[l] = 0;
	}
	return o;
}
module.exports.DaySix = function DaySix(reader) {
	const input = reader("daySix.txt");
	/* 
	const input = reader("daySixTest.txt");
	*/
	const formattedGroups = parseGroup(input.split("\n"), true)
	let n = 0;
	for (const group in formattedGroups) {
		n += formattedGroups[group].length;
	}
	// console.log(formattedGroups, n);

	const partTwoRaw = parseGroup(input.split("\n"), false);
	let i = 0, num = 0;
	for (const p in partTwoRaw) {
		let group = partTwoRaw[p];
		let lo = getLetterObject();
		for (const letter in lo) {
			for (const person of group) {
				if (person.indexOf(letter) > -1) {
					lo[letter]++;
				}
			}
		}
		for (const ll in lo) {
			if (lo[ll] === group.length) {
				num++;
			}
		}
		i++;
	}
	console.log(num);

}