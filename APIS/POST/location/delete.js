const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const { locationInstance } = require('../../../src/modules/companyLocations');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LOCATIONS.DELETE, security.verifyToken, security.verifyUser, async (req, res) => {
    const { locationId } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!locationId) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await locationInstance.delete(locationId)
        res.status(200).json({
            message: "Location deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router