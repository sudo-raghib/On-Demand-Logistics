const Driver = require("../models/Driver");

const assignDriver = async (booking) => {
  const { pickupLocation, vehicleType } = booking;

  // Find nearby available drivers
  const drivers = await Driver.find({
    availabilityStatus: 'Available',
    'currentLocation': {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [pickupLocation.coordinates[0], pickupLocation.coordinates[1]],
        },
        $maxDistance: 10000, // 10 km radius
      },
    },
    vehicleType,
  }).limit(10);

  if (drivers.length > 0) {
    // Assign the first available driver
    const driver = drivers[0];
    driver.availabilityStatus = 'Busy';
    await driver.save();
    return driver;
  } else {
    return null;
  }
};

module.exports = { assignDriver };
