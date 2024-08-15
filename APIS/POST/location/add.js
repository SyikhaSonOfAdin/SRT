const { locationInstance } = require('../../../src/modules/companyLocations');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LOCATIONS.ADD, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.COMPANY_LOCATIONS.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE), async (req, res) => {
    const { locationName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!locationName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await locationInstance.add(companyId, userId, locationName)
        res.status(200).json({
            message: "Location added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router