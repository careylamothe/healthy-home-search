var rp = require('request-promise');
var env = require('require-env');
var fs = require('fs');
var path = require('path');

module.exports = {
  getCrime: (location) => {
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth();
    var subMonth = (thisMonth - 12);

    if(subMonth < 1) {
      var lastYear = (thisYear - 1);
      var newMonth = 12 + subMonth;

      var searchDate = `AND year>= ${lastYear} AND month>= ${newMonth}`;
    } else {
      var searchDate = `AND year>= ${thisYear} AND month>= ${subMonth}`;
    }

    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/y7pv-r3kh.json?$where=within_circle(location,${location.long},${location.lat},1500) ${searchDate}`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then(function(crimeData) {

          var organizedCrimeCountObj = {}

          for (var i = 0; i < crimeData.length; i++) {
            if (organizedCrimeCountObj[crimeData[i].summarized_offense_description]) {
              organizedCrimeCountObj[crimeData[i].summarized_offense_description] += 1;
            } else {
              organizedCrimeCountObj[crimeData[i].summarized_offense_description] = 1;
            }
          }

           var organizedCrimeCountArray = [];

           for (var j = 0; j < Object.keys(organizedCrimeCountObj).length; j++) {
             organizedCrimeCountArray.push({'name':Object.keys(organizedCrimeCountObj)[j], 'size':organizedCrimeCountObj[Object.keys(organizedCrimeCountObj)[j]]})
           }

           var finalcrimeData = {
             name:"crimes",
             children: organizedCrimeCountArray
           };

        finalcrimeData = JSON.stringify(finalcrimeData);
        console.log(Object.keys(finalcrimeData).length);
        fs.writeFile(path.join(__dirname, '../public/crime.json'), finalcrimeData, function(writeErr){
          console.log(writeErr);
        });

        return JSON.parse(finalcrimeData);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
