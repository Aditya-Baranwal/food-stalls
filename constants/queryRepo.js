const CONSTANTS = require('../constants/appConstants');

module.exports = {
    sql : {
        
        food_facility_detail: { 
            read_1 : `select applicant as shopName, facility_type as facilityType, latitude, longitude from food_facility_detail where (latitude between {max_lat} and {min_lat}) and (longitude between {max_long} and {min_long}) limit {cursor},{limit}`,
        }

    },

    mongo : {

    }
};