const { reportInstance } = require('../../../src/modules/report');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const TABLES = require('../../../.conf/.conf_tables');
const express = require('express');
const router = express.Router();

const security = new Security()

router.get(ENDPOINTS.GET.REPORT.BY_COMPANY_ID, security.verifyToken, security.verifyPrivilege(TABLES.REPORT.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_READ), async (req, res) => {
    const companyId = security.decrypt(req.params.companyId)
    const searchPattern = req.query.s

    if (!companyId) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    try {
        const DATA = await reportInstance.get(companyId, searchPattern)
        res.status(200).json({
            data: DATA
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router