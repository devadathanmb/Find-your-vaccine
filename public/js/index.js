const statesApiUrl = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
const districtsApiUrl = "https://cdn-api.co-vin.in/api/v2/admin/location/districts";
const stateDrop = document.querySelector(".state-select");
const districtDrop = document.querySelector(".district-select");
let states = [];
document.addEventListener('DOMContentLoaded', () => {
  fetch(statesApiUrl).then(res => {
      return res.json();
    })
    .then(data => {
      let output = "";
      data.states.forEach(state => {
        output += `<option id=${state.state_id}>${state.state_name}</option>`;
      });
      stateDrop.innerHTML = output;
      populateDistrict();
    })
    .catch(err => {
      console.log(err);
    });
});

function populateDistrict() {
  let districtId = stateDrop.options[stateDrop.selectedIndex].id;
  console.log(districtsApiUrl + "/" + districtId);
  fetch(districtsApiUrl + "/" + districtId).then(res => {
      return res.json();
    })
    .then(data => {
      let output = "";
      data.districts.forEach(district => {
        output += `<option>${district.district_name}</option>`
      });
      districtDrop.innerHTML = output;
    })
    .catch(err => {
      console.log(err);
    });
}

stateDrop.addEventListener("change", function() {
  console.log("I got triggered");
  populateDistrict();
});