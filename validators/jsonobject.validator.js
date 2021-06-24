const BaseValidator = require('./base.validator');

class JsonObjectValidator extends BaseValidator {
    
    constructor(schema) {
        super();
        this.schema = schema;
    }

    create(data) {
        try {
            super.prepareValidationErrorObj(this.schema.validate(data, { abortEarly: false }));
        } catch (error) {
            throw error;
        }
    }

}


module.exports = JsonObjectValidator;