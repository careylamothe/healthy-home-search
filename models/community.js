var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getSchools: (location) => {
    var options = {
      method: 'GET',
      uri: 'https://data.kingcounty.gov/resource/cnyx-gwan.json?$where=within_circle(location_geo,' + location.long + ',' + location.lat + ',1500)',
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then(function(schoolData) {
        return schoolData;
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getParks: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/3c4b-gdxv.json?$where=within_circle(location,${location.long},${location.lat},1500)&city_feature=Parks`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (parkData) => {
        return parkData;
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getCulturalSpace: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/bsta-72tn.json?$select=name,location&$where=within_circle(location,${location.long},${location.lat},1500)&closed=0`,
      qs: {
        $$app_token: process.env.SODAKEY,
      },
      json:true
    }

    return rp(options)
      .then( (cultureData) => {
        return cultureData;
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getViewPoints: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/3c4b-gdxv.json?$where=within_circle(location,${location.long},${location.lat},1500)&city_feature=Viewpoints`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (viewpointData) => {
        return viewpointData;
      })
      .catch( (err) => {
        console.log(err);
      });
  },

  getRestaurants: (location) => {
    var options = {
      method: 'GET',
      uri: `https://developers.zomato.com/api/v2.1/geocode`,
      qs: {
        lat: '47.643966',
        lon: '-122.396583'
      },
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.ZOMATOKEY
      },
      json:true
    }
    console.log('key', process.env.ZOMATOKEY);
    return rp(options)
      .then( (restaurantData) => {
        console.log('zomato', restaurantData);
        return restaurantData;
      })
      .catch( (err) => {
        console.log('zomato error', err);
      });
  }
}
