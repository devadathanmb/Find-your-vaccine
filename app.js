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

let shortListedVaccineSessions = [];

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
  let minAge;
  let maxAge;

  if (age == "18 - 45") {
    minAge = 18;
    maxAge = 44;
  } else if (age == "Above 45") {
    minAge = 44;
  } else if (age == "15 - 18") {
    minAge = 15;
    maxAge = 18;
  }

  var stateId;
  var districtId;

  const free = (function() {
    if (req.body.free == "on") {
      return true;
    } else {
      return false;
    }
  })();

  const paid = (function() {
    if (req.body.paid == "on") {
      return true;
    } else {
      return false;
    }
  })();

  if (paid == false && free == false) {
    paid = true;
    free = true;
  }

  let date = new Date(req.body.date + "Z");
  date = format.asString('dd-MM-yyyy', date);


  const vaccineType = (function() {
    if (req.body.vaccineType == "Covishield") {
      return "COVISHIELD";
    } else if (req.body.vaccineType == "Covaxin") {
      return "COVAXIN";
    } else if (req.body.vaccineType == "Sputnik V") {
      return "SPUTNIK V";
    }
  })();


  const doseType = (function() {
    if (req.body.doseType == "First dose") {
      return "dose1";
    } else if (req.body.doseType == "Second dose") {
      return "dose2";
    } else if (req.body.doseType == "Booster dose") {
      return "dose3";
    }
  })();
  console.log(doseType, vaccineType, paid, free, maxAge, minAge);
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
        shortListSessions();
      }),
      function(error) {
        console.log(error);
      }
  }

  function shortListSessions() {
    vaccineSessions.forEach((session) => {
      if (session.vaccine == vaccineType) {
        if (session.allow_all_age == true) {
          if (doseType == "dose1" && session.available_capacity_dose1 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          } else if (doseType == "dose2" && session.available_capacity_dose2 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          }
        } else if (session.max_age_limit == 44 && minAge == 18) {
          if (doseType == "dose1" && session.available_capacity_dose1 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          } else if (doseType == "dose2" && session.available_capacity_dose2 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          }
        } else if (session.min_age_limit == 45 && minAge == 45) {
          if (doseType == "dose1" && session.available_capacity_dose1 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          } else if (doseType == "dose2" && session.available_capacity_dose2 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          }
        } else if (session.min_age_limit == 15 && minAge == 15) {
          if (doseType == "dose1" && session.available_capacity_dose1 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          } else if (doseType == "dose2" && session.available_capacity_dose2 > 0) {
            if (paid == true && free == true && session.fee >= 0) {
              shortListedVaccineSessions.push(session);
            } else if (paid == true && free == false && session.fee > 0) {
              shortListedVaccineSessions.push(session);
            } else if (free == true && session.fee == 0) {
              shortListedVaccineSessions.push(session);
            }
          }
        }
      }
    });
    renderOnPage();
  }

  function renderOnPage() {
    res.render("output", {
      searchDate: date,
      sessionList: shortListedVaccineSessions
    });
    shortListedVaccineSessions = [];
  }
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(PORT, function() {
  console.log("Server up and running at " + PORT);
});