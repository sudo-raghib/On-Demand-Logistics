const { Router } = require('express')
const router = Router()
const auth = require('../middleware/auth')

// TODO: Fleet Management - Get all drivers
router.get('/drivers', auth(), async (req, res) => {})

// TODO: Data Analytics - Get trip statistics
router.get('/analytics/trips', auth('admin'), async (req, res) => {})

module.exports = router
