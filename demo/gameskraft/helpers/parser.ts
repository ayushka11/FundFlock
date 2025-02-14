export default class Parser {
	static parseNumber(val: string): number {
		return Number.parseInt(val, 10);
	}

	static parseFloat(val: string): number {
		return Number.parseFloat(val);
	}

	static parseToTwoDecimal(val: number): number {
		return Parser.parseFloat(val.toFixed(2));
	}

	static parseToOneDecimal(val: number): number {
		return Parser.parseFloat(val.toFixed(1));
	}

	static parseToInt(val: number): number {
		return Parser.parseNumber(val.toFixed(0));
	}


}
