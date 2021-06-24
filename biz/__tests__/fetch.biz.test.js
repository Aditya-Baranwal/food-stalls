const chai = require('chai');
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect;
const sinon = require('sinon');
chai.use(chaiAsPromised);

const FetchBiz = require('../fetch.biz');
fetchBiz = new FetchBiz();
const {food_facility_detail} = require('../../constants/queryRepo').sql;


describe("test suit for fetch function", () => {
    
    let getBoundingBoxStub, runStub; 
    let body;
    
    beforeEach(async () => {
        
        body = {
            "location" : {
                "latitude" : 37.710841283585300,
                "longitude" : -122.399642614963160
            },
            "cursor" : 0,
            "limit" : 10 
        };
        
        getBoundingBoxStub = sinon.stub(fetchBiz, "getBoundingBox");
        runStub = sinon.stub(fetchBiz.sqlRepo, "run");
    });

    afterEach(async () => {
        getBoundingBoxStub.restore();
        runStub.restore();
    });
    
    let boxBoundary = {
        "max_lat": 37.701858078631936,
        "min_lat": 37.71982448853868,
        "max_long": -122.41099783720215,
        "min_long": -122.38828739272417
    }

    let queryResult = [
        {
          "shopName": "May Catering",
          "facilityType": "Truck",
          "latitude": "37.717779453626974",
          "longitude": "-122.391654765179340"
        },
        {
          "shopName": "Singh Brothers Ice Cream",
          "facilityType": "Truck",
          "latitude": "37.718522048566450",
          "longitude": "-122.396661444416800"
        },
        {
          "shopName": "May Catering",
          "facilityType": "Truck",
          "latitude": "37.718788079020090",
          "longitude": "-122.398105987750110"
        },
        {
          "shopName": "Singh Brothers Ice Cream",
          "facilityType": "Truck",
          "latitude": "37.718939819095944",
          "longitude": "-122.390517872065930"
        },
        {
          "shopName": "Singh Brothers Ice Cream",
          "facilityType": "Truck",
          "latitude": "37.719200217713310",
          "longitude": "-122.395976731095930"
        },
        {
          "shopName": "May Catering",
          "facilityType": "Truck",
          "latitude": "37.719431718480700",
          "longitude": "-122.398139506914180"
        }
    ]

    it("invalid limit", async () => {
        body.limit = 150;
        getBoundingBoxStub.withArgs(body.location.latitude, body.location.longitude, 1).returns(boxBoundary);
        runStub.resolves(queryResult);
        let result = {
            "foodKarts" : queryResult,
            "cursor" : 6
        };
        expect(await fetchBiz.fetch(body)).to.be.deep.equals(result);
    });

    it("query returns no data", async () => {
        getBoundingBoxStub.withArgs(body.location.latitude, body.location.longitude, 1).returns(boxBoundary);
        runStub.withArgs(food_facility_detail.read_1, {...boxBoundary, cursor : body.cursor, limit : body.limit}).resolves([]);
        let result = {
            "foodKarts" : [],
            "cursor" : 0
        }
        expect(await fetchBiz.fetch(body)).to.be.deep.equals(result);
    });

    it("successful call", async () => {
        getBoundingBoxStub.withArgs(body.location.latitude, body.location.longitude, 1).returns(boxBoundary);
        runStub.withArgs(food_facility_detail.read_1, {...boxBoundary, cursor : body.cursor, limit : body.limit}).resolves(queryResult);
        let result = {
            "foodKarts" : queryResult,
            "cursor" : 6
        }
        expect(await fetchBiz.fetch(body)).to.be.deep.equals(result);
    });

});

describe("test suit for getBoundingBox function", () => {

    it("invalid range", async () => {
        let currentLatitude = 37.710841283585300;
        let currentLongitude = -122.399642614963160;
        let range = null;
        let result = {
            "max_lat": 37.701858078631936,
            "min_lat": 37.71982448853868,
            "max_long": -122.41099783720215,
            "min_long": -122.38828739272417
        }
        expect(fetchBiz.getBoundingBox(currentLatitude, currentLongitude, range)).to.be.deep.equals(result);
    });

    it("at south pole", async () => {
        let currentLatitude = -90;
        let currentLongitude = -122.399642614963160;
        let range = null;
        let result = {
            "max_lat": -90,
            "max_long": -180,
            "min_lat": -89.99101679504663,
            "min_long": 180
        }
        expect(fetchBiz.getBoundingBox(currentLatitude, currentLongitude, range)).to.be.deep.equals(result);
    });

    it("at north pole", async () => {
        let currentLatitude = 90;
        let currentLongitude = -122.399642614963160;
        let range = null;
        let result = {
            "max_lat": 89.99101679504663,
            "max_long": -180,
            "min_lat": 90,
            "min_long": 180
        }
        expect(fetchBiz.getBoundingBox(currentLatitude, currentLongitude, range)).to.be.deep.equals(result);
    });

    it("at equators", async () => {
        let currentLatitude = 0;
        let currentLongitude = 0;
        let range = null;
        let result = {
            "max_lat": -0.008983204953369,
            "max_long": -0.008983204953369,
            "min_lat": 0.008983204953369,
            "min_long": 0.008983204953369
        }
        expect(fetchBiz.getBoundingBox(currentLatitude, currentLongitude, range)).to.be.deep.equals(result);
    });

    it("not at poles or equator", async () => {
        let currentLatitude = 37.710841283585300;
        let currentLongitude = -122.399642614963160;
        let range = 1;
        let result = {
            "max_lat": 37.701858078631936,
            "min_lat": 37.71982448853868,
            "max_long": -122.41099783720215,
            "min_long": -122.38828739272417
        }
        expect(fetchBiz.getBoundingBox(currentLatitude, currentLongitude, range)).to.be.deep.equals(result);
    });

});