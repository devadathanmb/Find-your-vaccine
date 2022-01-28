const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");
const format = require('date-format');

const app = express();

const PORT = process.env.PORT || 3000;

const statesApiUrl = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

const districtsApiUrl = "https://cdn-api.co-vin.in/api/v2/admin/location/districts";

const findByDistrictApiUrl = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict";

let states = [];

let districts = [];

let vaccineSessions = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");

});

app.post("/", function(req, res) {
  const state = req.body.state;
  const district = req.body.district;
  const age = req.body.age;
  var stateId;
  var districtId;
  const free = req.body.free;
  const paid = req.body.paid;
  let date = new Date(req.body.date + "Z");
  date = format.asString('dd-MM-yyyy', date);
  const vaccineType = req.body.vaccineType;
  const doseType = req.body.doseType;
  console.log(date);
  async function getStates() {
    try {
      const response = await axios.get(statesApiUrl);
      states = response.data.states;
      getStateId();
    } catch (error) {
      console.log(error);
    }
  }
  getStates();

  function getStateId() {
    for (let i = 0; i < states.length; i++) {
      if (state.toLowerCase().replace(/\s/g, '') === states[i].state_name.toLowerCase().replace(/\s/g, '')) {
        stateId = (states[i].state_id);
        break;
      }
    }
    getDistricts();
  }

  function getDistricts() {
    axios.get(districtsApiUrl + "/" + stateId).then(function(response) {
        districts = response.data.districts;
        getDistrictId();
      }),
      function(error) {
        console.log(error);
      }
  }

  function getDistrictId() {
    for (let i = 0; i < districts.length; i++) {
      if (district.toLowerCase().replace(/\s/g, '') === districts[i].district_name.toLowerCase().replace(/\s/g, '')) {
        districtId = districts[i].district_id;
        break;
      }
    }
    findVaccine();
  }

  function findVaccine() {
    axios.get(findByDistrictApiUrl + "?district_id=" + districtId + "&date=" + date).then(function(response) {
        vaccineSessions = response.data.sessions;
        console.log(vaccineSessions);
      }),
      function(error) {
        console.log(error);
      }
  }
});

app.listen(PORT, function() {
  console.log("Server up and running at " + PORT);
});