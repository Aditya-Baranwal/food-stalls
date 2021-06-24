const {food_facility_detail} = require('../constants/queryRepo').sql;
const SqlRepo = require('./../repositories/mysql.repository');

const util = require('../utils/helper.utility');

class FetchBiz {
	
	constructor() {
		this.sqlRepo = new SqlRepo();
	}

	/**
	 * takes current location.
	 * makes a box boundary around current location with given range value.
	 * based on corner cordinates of box, we query data of food stalls and return the same.
	 * cursor, limit feilds are used for pagination 
	 * @returns list of food stalls near a location.
	 */
	async fetch({location, cursor, limit}) {
		try {

			if(!cursor) cursor = 0;
			
			if(!limit || limit > 100) limit = 10; 

			let rangeInKm = 1, {latitude, longitude} = location;
			
			let boxBoundary = this.getBoundingBox(latitude, longitude, rangeInKm);
			let foodKartsDetails = await this.sqlRepo.run(food_facility_detail.read_1, {...boxBoundary, cursor, limit});
			
			let result = {
				foodKarts : foodKartsDetails ? foodKartsDetails : [],
				cursor : foodKartsDetails ? cursor += (foodKartsDetails.length) : cursor
			}
			
			return result;

		} catch (error) {
			throw(error);
		}
	}

	/**
	 * This function takes latitude, longitude and range(in kms)
	 * @param {*} currentLatitude 
	 * @param {*} currentLongitude 
	 * @param {*} range 
	 * @returns max_latitude, min_latitude, max_log, min_long.
	 * max_latitude ==> latitude of position after moving upwards by range(kms) to current location
	 * min_latitude ==> latitude of position after moving downwards by range(kms) to current location
	 * max_longitude ==> longitude of position after moving right by range(kms) to current location
	 * min_longitude ==> longitude of position after towards left by range(kms) to current location
	 * code is based on :: following block
	 * http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
	 */
	getBoundingBox( currentLatitude, currentLongitude, range) {

		if (range == null || range == undefined || range == 0) range = 1;
		
		const MIN_LAT = util.degreeToRadius(-90),
			MAX_LAT = util.degreeToRadius(90),
			MIN_LON = util.degreeToRadius(-180),
			MAX_LON = util.degreeToRadius(180);

		let ldEarthRadius = 6378.1, ldDistanceInRadius = range / ldEarthRadius;
		
		let lsLatitudeInDegree = currentLatitude, 
			lsLongitudeInDegree = currentLongitude,
			lsLatitudeInRadius = util.degreeToRadius(lsLatitudeInDegree), 
			lsLongitudeInRadius = util.degreeToRadius(lsLongitudeInDegree);
		
		let lsMinLatitude, lsMaxLatitude, lsMinLongitude, lsMaxLongitude, deltaLon;

		// minimum and maximum latitudes for given distance
		lsMinLatitude = lsLatitudeInRadius - ldDistanceInRadius;
		lsMaxLatitude = lsLatitudeInRadius + ldDistanceInRadius;

		// minimum and maximum longitudes for given distance
		lsMinLongitude = 0;
		lsMaxLongitude = 0;

		// define deltaLon to help determine min and max longitudes
		deltaLon = Math.asin(Math.sin(ldDistanceInRadius) / Math.cos(lsLatitudeInRadius));

		if (lsMinLatitude > MIN_LAT && lsMaxLatitude < MAX_LAT) {
			lsMinLongitude = lsLongitudeInRadius - deltaLon;
			lsMaxLongitude = lsLongitudeInRadius + deltaLon;
			
			if (lsMinLongitude < MIN_LON) {
				lsMinLongitude = lsMinLongitude + 2 * Math.PI;
			}
			
			if (lsMaxLongitude > MAX_LON) {
				lsMaxLongitude = lsMaxLongitude - 2 * Math.PI;
			}
		
		} else {
			// a pole is within the given distance
			lsMinLatitude = Math.max(lsMinLatitude, MIN_LAT);
			lsMaxLatitude = Math.min(lsMaxLatitude, MAX_LAT);
			lsMinLongitude = MIN_LON;
			lsMaxLongitude = MAX_LON;
		}

		return {
			max_lat : Number(util.radiusToDegree(lsMinLatitude).toFixed(15)),
			min_lat : Number(util.radiusToDegree(lsMaxLatitude).toFixed(15)),
			max_long : Number(util.radiusToDegree(lsMinLongitude).toFixed(15)),
			min_long : Number(util.radiusToDegree(lsMaxLongitude).toFixed(15))
		};
	};

}

module.exports = FetchBiz;
