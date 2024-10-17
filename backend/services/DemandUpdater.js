
const DemandData = require('../models/DemandData');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

const updateDemandData = async () => {
  const regions = ['RegionA', 'RegionB', 'RegionC'];

  for (const region of regions) {
    const timeWindow = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const requests = await Booking.countDocuments({
      'pickupLocation.region': region,
      createdAt: { $gte: timeWindow },
    });

    const availableDrivers = await Driver.countDocuments({
      availabilityStatus: 'Available',
      region: region,
    });

    // Save the demand data
    await DemandData.create({
      region,
      requests,
      availableDrivers,
    });
  }
};

module.exports = { updateDemandData };
