// routes/admin.js

const { Router } = require("express");
const router = Router();
const { countDocuments, aggregate } = require("../models/Booking");
const { find } = require("../models/Driver");
const auth = require("../middleware/auth");

// Fleet Management - Get all drivers
router.get("/drivers", auth("admin"), async (req, res) => {
  try {
    const drivers = await find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Data Analytics - Get trip statistics
router.get("/analytics/trips", auth("admin"), async (req, res) => {
  try {
    const totalTrips = await countDocuments({ status: "delivered" });
    const avgTripTimeData = await aggregate([
      { $match: { status: "delivered" } },
      {
        $project: {
          duration: {
            $subtract: ["$deliveryTime", "$pickupTime"],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    const avgTripTime = avgTripTimeData[0] ? avgTripTimeData[0].avgDuration : 0;

    res.json({ totalTrips, avgTripTime });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
