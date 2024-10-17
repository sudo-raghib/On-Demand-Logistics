const DemandData = require('../models/DemandData')

const getDemandMultiplier = async (region) => {
  // Fetch the latest demand data for the region
  const demandData = await DemandData.findOne({ region }).sort({
    timestamp: -1,
  })

  if (!demandData) {
    return 1 // No demand data, normal pricing
  }

  const { requests, availableDrivers } = demandData

  const demandSupplyRatio = requests / (availableDrivers || 1) // Avoid division by zero

  let multiplier = 1 // Base multiplier

  if (demandSupplyRatio > 1) {
    multiplier += (demandSupplyRatio - 1) * 0.2 // 20% increase per unit over 1
    multiplier = Math.min(multiplier, 3) // Maximum 3x surge
  }

  return multiplier
}

module.exports = { getDemandMultiplier }
