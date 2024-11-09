const mongoose = require('mongoose')
const PriceFactor = require('../models/PriceFactor')

const setupPricingData = async () => {
  try {
    const connectionUrl=process.env.DB_URL||"mongodb://localhost:27017"
    await mongoose.connect(`${connectionUrl}/logistics`, {
      authSource: 'admin', 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    const priceFactors = [
      {
        vehicleType: 'SmallVan',
        baseFare: 5.0,
        perKilometerRate: 1.2,
        perKilogramRate: 0.5,
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
      } else {
        // Update existing record with new pricing factors
        await PriceFactor.updateOne({ vehicleType: factor.vehicleType }, factor)
      }
    }
  } catch (error) {
    console.error('Error setting up pricing data:', error)
  } finally {
    await mongoose.disconnect()
  }
}

setupPricingData()
