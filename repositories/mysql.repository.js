const mysql = require('../db/mysql');

class QueryRepo {

	async run(qry,data) {
		try {
			
			let query = qry;
			
			for (var key in data) {
				let rx = new RegExp(`{${key}}`, 'gi');
				if(typeof data[key] === 'number') query = query.replace(rx, data[key] || 0);
				else query = query.replace(rx, data[key] || '');
			}
			
			const result = await mysql.execute(query, []);
			
			if (result.length > 0) return result;

			return null;
		
		} catch (error) {
			throw(error);
		}
	}

	async execute(query, params = [], returnFirst = true) {
        const result = await mysql.execute(query, params);

        if (Array.isArray(result)) {
            if (!result.length) {
                return null;
            }
            
            if (returnFirst) {
                return result[0];
            }
        }

        return result;
    }

}

module.exports = QueryRepo;
