const uuid = require('uuid/v1');
const httpContext = require('express-http-context');
const { EVENT } = require('../constants/appConstants');
const { pathToRegexp } = require("path-to-regexp");
const _ = require('lodash');
module.exports = async (request, response, next) => {
	try {
		httpContext.set('uuid', uuid());
		let event = "";
		let url = request.url.split('?') && request.url.split('?')[0];
		for(const reg in EVENT){
			let regex = pathToRegexp(reg);
			if(regex.test(url)){ 
				try{
					event = EVENT[reg][request.method];
					break;
				}catch(err){
					break;
				}
			}
		}
		httpContext.set('event', event);
		next();
	} catch (error) {
		next(error);
	}
};
