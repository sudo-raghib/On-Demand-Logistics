const mongoose = require('mongoose')
const PriceFactor = require('../models/PriceFactor')

const setupPricingData = async () => {
  try {
    await mongoose.connect('mongodb://localhost/logistics', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const priceFactors = [
      {
        vehicleType: 'SmallVan',
        baseFare: 5.0,
        perKilometerRate: 1.2,
        perKilogramRate: 0.5, // New field for per kilogram rate
      },
      {
        vehicleType: 'MediumTruck',
        baseFare: 10.0,
        perKilometerRate: 1.5,
        perKilogramRate: 0.4,
      },
      {
        vehicleType: 'LargeTruck',
        baseFare: 15.0,
        perKilometerRate: 2.0,
        perKilogramRate: 0.3,
      },
    ]

    for (const factor of priceFactors) {
      const exists = await PriceFactor.findOne({
        vehicleType: factor.vehicleType,
      })
      if (!exists) {
        await PriceFactor.create(factor)
        console.log(`Inserted pricing for ${factor.vehicleType}`)
      } else {
        // Update existing record with new pricing factors
        await PriceFactor.updateOne({ vehicleType: factor.vehicleType }, factor)
        console.log(`Updated pricing for ${factor.vehicleType}`)
      }
    }
  } catch (error) {
    console.error('Error setting up pricing data:', error)
  } finally {
    await mongoose.disconnect()
  }
}

setupPricingData()
