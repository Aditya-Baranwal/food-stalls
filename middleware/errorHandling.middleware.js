const config = require('config');

const { BaseException } = require('../exceptions');

const env = config.get('env');

module.exports = async (error, request, response, next) => {
	try {
		var message = error && error.message ? error.message : error;
		message = error && error.error && error.error.message ? error.error.message : message;
		message = error && error.error && error.error.error && error.error.error.message ? error.error.error.message : message;

		//message = message && message[0];
		const errorObj = {
			message: message ? message : 'Oops! something went wrong',
			code: 'ERROR',
			stack: error && error.stack && env === 'debug' ? error.stack : '',
		};
		let status = 500;
		if (error instanceof Error) {
			status = error.statusCode || status;
			errorObj.message = error.message;
		}
		if (error instanceof BaseException) {
			status = error.status;
			errorObj.message = error.message;
			errorObj.fields = error.fields ? error.fields : [];
			errorObj.code = error.code;
		}
		return response.status(status).json(errorObj);
	} catch (e) {
		return response.status(500).json({ 
			message: 'Internal server error',
			code: 'INTERNAL_ERROR',
		});
	}
};
