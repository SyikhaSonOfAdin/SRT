const { locationInstance } = require('../../../src/modules/companyLocations');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LOCATIONS.EDIT, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.COMPANY_LOCATIONS.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE), async (req, res) => {
    const { locationId, locationName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!locationId || !locationName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await locationInstance.edit(locationId, locationName)
        res.status(200).json({
            message: "Location edited successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router