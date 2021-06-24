const { SchemaException } = require('../exceptions/');

class BaseValidator {
	
	prepareValidationErrorObj(validatorResult) {
		try {
			if (validatorResult.error) {
				throw new SchemaException(validatorResult.error);
			}
		} catch (error) {
			throw(error);
		}
	}
}

module.exports = BaseValidator;
