
const express = require('express');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const report = require('../../../src/modules/report');
const Security = require('../../../src/middleware/security');
const router = express.Router();

const security = new Security()

router.get(ENDPOINTS.GET.REPORT.BY_COMPANY_ID, async (req, res) => {
    try {
        const companyId = security.decrypt(req.params.companyId)
        // await report.get(companyId)
        res.status(200).json({
            message: companyId
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router