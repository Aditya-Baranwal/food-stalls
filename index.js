const express = require('express');
const bodyParser = require('body-parser');
const httpContext = require('express-http-context');

const { 
	errorHandlingMiddleware, 
	responseMiddleware, 
  	requestMiddleware, 
} = require('./middleware');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(httpContext.middleware);
		
app.use(requestMiddleware);

app.use(responseMiddleware);

app.use('/', require('./routes/urls'));

app.use(errorHandlingMiddleware);

var port = process.env.PORT || 8000;
app.listen(port);

console.log(`Server started on port ${port} on ENV: ${process.env.NODE_ENV}`);

module.exports = app;