function calculatePrice({ distance, demandFactor, itemWeight }) {
  const baseFare = 5; // base fare in currency units
  const distanceRate = 2; // per km
  const weightRate = 1.5;

  const distanceCost = distance * distanceRate;
  const weightCost = itemWeight * weightRate;

  return (baseFare + distanceCost + weightCost) * demandFactor;
}

function calculateDistance(pickup, dropoff) {
  // We can do distance calculation logic using the Haversine formula or an API
  return 10; // Placeholder value
}

function calculateEstimatedCost({
  pickup,
  dropoff,
  itemWeight,
  demandFactor = 1, // To support surge pricing
}) {
  const distance = calculateDistance(pickup, dropoff);
  return calculatePrice({ distance, itemWeight, demandFactor });
}

module.exports = { calculateEstimatedCost, calculatePrice, calculateDistance };
