const BaseException = require('./base.exception');

class SchemaException extends BaseException {
	constructor(errors) {        
		super('Bad Schema', 'SCHEMA_ERROR', 400);
		this.fields = errors.details.map(error => ({
			description: error,
		}));
	}
}

module.exports = SchemaException;
