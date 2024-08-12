const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();

const security = new Security()

router.get(ENDPOINTS.GET.USER.BY_COMPANY_ID, security.verifyToken, async (req, res) => {
    const companyId = security.decrypt(req.params.companyId)

    if (!companyId) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    try {
        const CONNECTION = await SRT.getConnection()
        try {
            await CONNECTION.beginTransaction()
            const DATA = await userInstance.get(CONNECTION, companyId)
            await CONNECTION.commit()
            res.status(200).json({
                data: DATA
            })
        } catch (error) {
            await CONNECTION.rollback()
            res.status(500).json({
                message: error.message
            })
        } finally {
            CONNECTION.release()
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router