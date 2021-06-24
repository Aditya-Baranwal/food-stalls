
module.exports = {

    degreeToRadius (value) {
		return value * (Math.PI / 180);
	},

	radiusToDegree (value) {
		return (180 * value) / Math.PI;
	},

}