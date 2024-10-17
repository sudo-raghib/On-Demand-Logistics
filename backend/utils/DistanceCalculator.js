const geolib = require('geolib');

const geolibDistance = (coord1, coord2) => {
  const distance = geolib.getPreciseDistance(
    { latitude: coord1[1], longitude: coord1[0] },
    { latitude: coord2[1], longitude: coord2[0] }
  );

  return distance / 1000; // Distance in kilometers
};

module.exports = { geolibDistance };
