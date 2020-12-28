class BagHandler {
	constructor(_definition, cs) {
		this.holdsBagReference = false;
		this.definition = _definition;
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
		return colorString.match(/^\d{1,2}-([a-z]+-[a-z]+)/)[1];
	}
	parseColorString(cs) {
		cs = cs.replace(/s$/, '')
		this.colors = [];
		let p = cs.split(",");
		if (p[0] !== 'no-other-bag') {
			for (const cf of p) {
				let colorDefinition = this.createColorDefinition(cf);
				// if (colorDefinition === "shiny-gold") { this.holdsBagReference = true; }
				this.colors.push(colorDefinition)
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

const _parseInput = array => {
	const legend = {};
	for (let item of array) {
		let reg = RegExp(/^([a-zA-Z]+\s[a-zA-Z]+)\sbags\scontain\s/)
		let pp = item.match(reg)
		if (pp) {
			let name = pp[1].replace(/\s/, '-');
			if (name === 'shiny-gold') { continue; }
			item = item.replace(reg, '')
			item = item.replace(/\.$/, '');
			item = item.replace(/\,\s/g, ',')
			item = item.replace(/\s/g, '-')
			legend[name] = new Bag(name, item);
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
module.exports.DaySeven = function DaySeven(reader) {
	const input = reader("daySeven.txt");
	/*
	const input = reader("daySevenTest.txt");
	 
	*/
	let parsed = _parseInput(input.replace(/\r/g, '').split("\n"));
	parsed = _extractCouldContainPartOne(parsed)
	/* 
	console.log(parsed);
	return; 
	*/
	let partOneHits = lookForPartOne('shiny-gold', parsed);
	console.log(`\nPart on hits: ${partOneHits}`);
	// console.log(parsed)
}