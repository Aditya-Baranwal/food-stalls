An application, to fetch near by food stalls.

Creating table to store details of food stalls

create table food_facility_detail (
	location_id int(11) not null,
    	applicant varchar(100) default null,
    	facility_type enum('Truck', 'Push Cart', '') default null,
    	location_description varchar(200) default null,
    	address varchar(50) default null,
    	food_item varchar(500) default null,
    	latitude decimal(18,15) default null,
    	longitude decimal(18,15) default null,
    	zip_code varchar(10) default null,
    	primary key(location_id),
    	index (latitude),
    	index (longitude)
);

curl for making request.

curl --location --request GET 'http://localhost:8000/v1/food-stall' \
--header 'Content-Type: application/json' \
--data-raw '{
    "location" : {
        "latitude" : 37.710841283585300,
        "longitude" : -122.399642614963160
    },
    "cursor" : 10,
    "limit" : 10 
}'


1) To run this project need to have mysql server on, with table created and data added to table.
2) Follow following steps to run application 
npm install.
node start.
