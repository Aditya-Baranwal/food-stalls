const httpContext = require('express-http-context');

module.exports = async (request, response, next) => {
	try {
		const oldJson = response.json;

		response.json = (data, message, services = null) => {
			let uuid = httpContext.get('uuid');
			let newResponseData = {};
			if (!data || (data.code && data.code.indexOf('ERROR') > -1)) {
				newResponseData = {
					success: false,
					uuid : uuid,
					error: data
				};
			} else {
				newResponseData = {
					success: true,
					message: message || '',
					uuid : uuid,
					data : data.result || ''
				};
			}

			response.json = oldJson;

			return oldJson.call(response, newResponseData);
		};
		next();
	} catch (error) {
		next(error);
	}
};
