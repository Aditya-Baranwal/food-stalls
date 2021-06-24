const Joi = require('@hapi/joi');
const {number} = require('../schema/constants/joi-constants');


module.exports = {

    "food-stall-detail" : Joi.object({
        "location" : Joi.object({
            "latitude" : number.max(90).min(-90).required(),
            "longitude" : number.max(180).min(-180).required()
        }).unknown(false),
        cursor : number.min(0).required(),
        limit : number.min(0).required()   
    }).unknown(false).options({abortEarly : false})

};