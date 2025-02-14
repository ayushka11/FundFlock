export default class Parser {
	static parseNumber(val: string): number {
		return Number.parseInt(val, 10);
	}

	static parseFloat(val: string): number {
		return Number.parseFloat(val);
	}

	static parseToTwoDecimal(val: number): number {
		return Number.parseFloat(val.toFixed(2));
	}

	static parseToThreeDecimal(val: number): number {
		return Number.parseFloat(val.toFixed(3));
	}

	static roundOffToNearestNumber(val: number): number {
		return Math.round(val);
	}
}
