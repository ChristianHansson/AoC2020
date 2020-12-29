class BagHandler {
	constructor(_definition, cs) {
		this.definition = _definition;
		this.holdsBagReference = false;
		this.containsNumberOfColorDefinition = {};
		this.parseColorString(cs);
		this.partOfAnotherBag = [];
	}
	pushReference(ref) {
		for (const r of ref) {
			if (!this.partOfAnotherBag.includes(r) && r !== this.definition) {
				this.partOfAnotherBag.push(r);
			}
		}
	}
	getReferences(bags) {
	}
	_getReferences(bags) {
		for (const bagIndex in bags) {
			let bag = bags[bagIndex];
			if (bag.definition !== this.definition) {
				if (bag.colors.includes(this.definition)) {
					this.pushReference(bag.colors);
				}
			}
		}

		for (const bagIndex in bags) {
			let bag = bags[bagIndex];
			if (bag.definition === this.definition) {
				for (const ref of bag.colors) {
					if (ref === "shiny-gold") { continue; }
					this.holdsBagReference = (this.holdsBagReference === false) ?
						bags[ref].colors.includes('shiny-gold') :
						this.holdsBagReference;
				}
				for (const ref of bag.partOfAnotherBag) {
					if (ref === "shiny-gold") { continue; }
					this.holdsBagReference = (this.holdsBagReference === false) ?
						bags[ref].partOfAnotherBag.includes('shiny-gold') :
						this.holdsBagReference;
				}
			}
		}
	}
	createColorDefinition(colorString) {
		return colorString.match(/^(\d{1,2})-([a-z]+-[a-z]+)/);
	}
	parseColorString(cs) {
		cs = cs.replace(/s$/, '')
		this.colors = [];
		let p = cs.split(",");
		this.numOfContainingBags = 0;
		if (p[0] !== 'no-other-bag') {
			for (const cf of p) {
				let colorDefinition = this.createColorDefinition(cf);
				// if (colorDefinition === "shiny-gold") { this.holdsBagReference = true; }
				this.colors.push(colorDefinition[2]);
				this.containsNumberOfColorDefinition[colorDefinition[2]] = colorDefinition[1];
				this.numOfContainingBags += Number(colorDefinition[1]);
			}
		}
	}
}

class Bag extends BagHandler {
	constructor(...colorargs) {
		super(...colorargs);
	}
	checkDirect() {
		if (this.colors.includes('shiny-gold')) {
			this.holdsBagReference = true;
		}
	}
	checkColors() {
		return this.colors.includes('shiny-gold');
	}
	checkReferences(bags) {
		if (this.holdsBagReference === true) { return true; }
		for (const ref of this.colors) {
			let directColors = bags[ref].checkColors();
			if (directColors) {
				this.holdsBagReference = directColors;
				continue;
			}

			try {
				let refHits = bags[ref].checkReferences(bags);
				if (refHits) {
					this.holdsBagReference = true;
				}
			} catch (error) {
				console.log(error)
			}
		}
		return this.holdsBagReference;
	}
}
let ShinyGoldBag = null;
const _parseInput = array => {
	const legend = {};
	for (let item of array) {
		let reg = RegExp(/^([a-zA-Z]+\s[a-zA-Z]+)\sbags\scontain\s/)
		let pp = item.match(reg)
		if (pp) {
			let name = pp[1].replace(/\s/, '-');
			item = item.replace(reg, '')
			item = item.replace(/\.$/, '');
			item = item.replace(/\,\s/g, ',')
			item = item.replace(/\s/g, '-')
			if (name === 'shiny-gold') {
				ShinyGoldBag = new Bag(name, item);
			} else {
				legend[name] = new Bag(name, item);
			}
		}
		// break
	}
	return legend;
}
const _extractCouldContainPartOne = legend => {
	for (const bag in legend) {
		legend[bag].getReferences(legend);
		legend[bag].checkDirect();
		if (legend[bag].definition === 'dark-orange') {
		}
		legend[bag].checkReferences(legend);
	}
	return legend;
};
const lookForPartOne = (lookFor, bags) => {
	let numOfHits = 0;
	for (const bagIndex in bags) {
		numOfHits += (bags[bagIndex].holdsBagReference) ? 1 : 0;
	}
	return numOfHits;
};
let calcArr = [];
const checkSubBags = (bags, thisBag, num, colorname) => {
	if (colorname === 'shiny-gold') { return; }
	// calcArr.push(function () { return 3 * 2; })
	// console.log(bagObj, calcArr)
	/* console.log(
		thisBag.definition,
		thisBag.containsNumberOfColorDefinition,
		thisBag.colors,
		num,
		// thisBag
	) */
	try {

		if (+thisBag.numOfContainingBags > 1) {

			/* console.log(`${+num} + (${+num} * ${+thisBag.numOfContainingBags})`);
			calcArr.push(function () { return +num + (+num * +thisBag.numOfContainingBags) })
			if (thisBag.colors.length) {
				for (const subBag in thisBag.containsNumberOfColorDefinition) {
					checkSubBags(bags, bags[subBag], +thisBag.containsNumberOfColorDefinition[subBag], subBag)
				}
			} */
		} else {
			// calcArr.push(function () { return +num })
		}
	} catch (error) {
		console.log(thisBag, colorname)
	}

	/* for (const bag in thisBag.containsNumberOfColorDefinition) {
		console.log(bags[bag], bags[bag].numOfContainingBags)
	} */

};
console.log(
	2 + 2 * 2,
	2 + 2 * 6,
	2 + 2 * 14,
	2 + 2 * 30,
	2 + 2 * 62,
	"\n"
)


/*

shiny gold has 2 dark red = 2 + 2 * 94 == 190
dark red has 2 dark orange = 2 + 2 * 46 == 94
dark orange has 2 dark greek = 2 + 2 * 22 == 46
dark yellow has 2 dark green = 2 + 2 * 10 == 22
dark green has 2 dark blue = 2 + 2 * 2 == 10
dark blue = 2 dark violet no children == 2 --


1558 = fel
123572147110256480 = fel
*/
let haveCounted = {};
const loopPartTwo_ = (bags, shiniybag) => {
	let num = 0;
	for (const s in shiniybag.containsNumberOfColorDefinition) {
		let temp = +shiniybag.containsNumberOfColorDefinition[s] + +shiniybag.containsNumberOfColorDefinition[s] * +lookForPartTwo(bags, bags[s])
		console.log(temp)
		num += temp;
	}
	return num;
};
const lookForPartTwo = (bags, bag, num) => {
	num = num || +bag.numOfContainingBags;
	for (const color in bag.containsNumberOfColorDefinition) {
		let firstNum = bag.containsNumberOfColorDefinition[color];
		if (bags.hasOwnProperty(color) && +bags[color].numOfContainingBags > 0) {
			num = +firstNum + (+firstNum * num);
			console.log(`${color} - ${+firstNum} + (${+firstNum} * ${+num})`);
			console.log(color, bags[color].colors)
			num = lookForPartTwo(bags, bags[color], num)
		}
		break

	}
	return num
};
let topMostBag = {};
const traverse_ = (bags, bag, num, topBag) => {
	if (bag.numOfContainingBags < 1) { return num; }
	console.log(bag.definition, bag.numOfContainingBags, num)
	for (const color in bag.containsNumberOfColorDefinition) {
		num += traverse(bags, bags[color], num, topBag)
	}
	return num;
}

const loopPartTwo = (bags, shiniybag) => {
	let nn = 0;
	for (const color in shiniybag.containsNumberOfColorDefinition) {
		// if (color !== 'pale-purple') { continue; }
		let numOfColor = Number(shiniybag.containsNumberOfColorDefinition[color]);
		if (numOfColor > 0) {

			let num = traverse(bags, bags[color], bags[color].numOfContainingBags, color);
			// nn += numOfColor + numOfColor * num;

			console.log(`\t${color} - ${numOfColor} - ${num}\n`);
		}

	}
	// 'light-maroon' = 0
	/* ['pale-purple', 'wavy-cyan',].forEach(a => {
		console.log(bags[a])
	}) */
	return nn;
}
const tt = obj => {
	for (const key in obj) {
		obj[key] = Number(obj[key])
	}
	return obj
}
const rr = b => {
	return {
		definition: b.definition,
		contains: tt(b.containsNumberOfColorDefinition),
		number: +b.numOfContainingBags
	}
};
const _reduceToPartTwo = bags => {
	let o = {};
	for (const bag in bags) {
		o[bag] = rr(bags[bag]);
	}
	return o;
}

const singleBags = {};
const traverse = (bags, bag, num) => {
	num = num || 0;
	for (const b in bag.contains) {
		if (bags[b].number > 0) {
			let tempNum = traverse(bags, bags[b], num)
			num = bag.number;
			if (tempNum > 0) {
				console.log(bag.definition, "contains: ", bag.contains[b], bags[b].definition, "number is: ", tempNum, num)

			}
			// num += (bag.contains[b] + bag.contains[b] * tempNum);
			// console.log(b, bag.contains[b], tempNum, `${bag.contains[b]} + ${bag.contains[b]} * ${tempNum}`)
			// break;
		} else {
			// num = bag.number
		}
	}
	return num;
}
const parttwo = bags => {
	console.log(traverse(bags, ShinyGoldBag), "\n")
	// console.log(bags['shiny-magenta'], bags['plaid-black'])
	/* let finalNun = 0;
	for (const a in ShinyGoldBag.containsNumberOfColorDefinition) {
		console.log("start: ", a);
		let num = +ShinyGoldBag.containsNumberOfColorDefinition[a] + +ShinyGoldBag.containsNumberOfColorDefinition[a] * traverse(bags, bags[a], 0);
		console.log(a, num)
		finalNun += num
	}
	console.log("\t---->", finalNun) */
}
module.exports.DaySeven = function DaySeven(reader) {
	const input = reader("daySeven.txt");
	/*
	const input = reader("daySevenTest.txt");
	const input = reader("daySevenTest2.txt");
	black pigs bags contain 1 light red bag
	*/
	let parsed = _parseInput(input.replace(/\r/g, '').split("\n"));
	parsed = _extractCouldContainPartOne(parsed)
	parsed = _reduceToPartTwo(parsed);
	// ShinyGoldBag = rr(ShinyGoldBag);
	// let partOneHits = lookForPartOne('shiny-gold', parsed);
	// console.log(`\nPart on hits: ${partOneHits}`);
	// console.log(ShinyGoldBag, lookForPartTwo(parsed, ShinyGoldBag));
	// console.log(ShinyGoldBag, loopPartTwo(parsed, ShinyGoldBag));
	// parttwo(parsed);
	/*
	console.log(ShinyGoldBag);
	console.log(parsed);
	*/
	// LOL i stole this
	const ss = input.replace(/\r/g, '').split("\n");
	const tree = ss.reduce((tree, line) => {
		const color = /(^.*) bags contain/.exec(line)[1];
		tree[color] = [];

		const matches = line.matchAll(/,? (\d+) ([^,.]*) bags?/g);
		for (const match of matches) {
			for (let i = 0; i < parseInt(match[1]); i++) {
				tree[color].push(match[2]);
			}
		}
		return tree;
	}, {});

	const depth = (color) => {
		if (tree[color] === []) return 1;
		return tree[color].reduce((acc, color) => acc + depth(color), 1);
	};

	console.log(depth("shiny gold") - 1);
}