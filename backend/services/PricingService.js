// services/PricingService.js
const PriceFactor = require('../models/PriceFactor')
const { geolibDistance } = require('../utils/DistanceCalculator')
const { getDemandMultiplier } = require('./DemandService')

const calculatePrice = async (
  pickupLocation,
  dropOffLocation,
  vehicleType,
  itemWeight
) => {
  // Step 1: Calculate distance between pickup and drop-off locations
  const distance = geolibDistance(
    pickupLocation.coordinates,
    dropOffLocation.coordinates
  )

  // Step 2: Retrieve base fare, per kilometer rate, per kilogram rate from PriceFactor model
  const pricing = await PriceFactor.findOne({ vehicleType })

  if (!pricing) {
    throw new Error('Pricing not set for this vehicle type')
  }

  const { baseFare, perKilometerRate, perKilogramRate, region } = pricing

  // Step 3: Calculate estimated cost
  const distanceCost = perKilometerRate * distance
  const weightCost = perKilogramRate * itemWeight

  const estimatedCost = baseFare + distanceCost + weightCost

  // Step 4: Get demand multiplier based on pickup location region
  const pickupRegion = region || 'default' // Use region from pricing or default

  const demandMultiplier = await getDemandMultiplier(pickupRegion)

  // Step 5: Apply surge pricing multiplier
  const finalCost = estimatedCost * demandMultiplier

  // Round off the cost to two decimal places
  const roundedCost = Math.round(finalCost * 100) / 100

  return roundedCost
}

module.exports = { calculatePrice }
