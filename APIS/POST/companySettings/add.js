const { settingsInstance } = require('../../../src/modules/companySettings');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const SRT = require('../../../.conf/.conf_database');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.SETTINGS.CONFIG, security.verifyToken, security.verifyUser, async (req, res) => {
    const { companyCode } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!companyCode) return res.status(403).json({ message: "Invalid parameters" })

    try {
        const CONNECTION = await SRT.getConnection()
        try {
            await CONNECTION.beginTransaction()
            await settingsInstance.add(CONNECTION, companyId, userId, companyCode)
            const DATA = await settingsInstance.get(CONNECTION, companyId)
            await CONNECTION.commit()
            res.status(200).json({
                message: "Link generated successfully",
                data: DATA
            })
        } catch (error) {
            CONNECTION.rollback()
            res.status(500).json({
                message: error.message,
            })
        } finally {
            CONNECTION.release()
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router