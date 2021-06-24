const FetchBiz = require('../biz/fetch.biz');
const requestScehma = require('../schema/request.schema');
const JsonObjectValidator = require('../validators/jsonobject.validator');

class FoodStallController {

	constructor() {
		this.fetchBiz = new FetchBiz();
	}

	register(app) {
		app.route('/v1/food-stall')
			.get(async (request, response, next) => {
				try {

					let {body} = request;

					new JsonObjectValidator(requestScehma['food-stall-detail']).create(body);
				
					const result = await this.fetchBiz.fetch(body);
					
					response.json(
						{
							result,
						},
						'fetching list of nearby stalls',
						null
					);

				} catch (error) {
					next(error);
				}
			});

	}
}

module.exports = FoodStallController;
