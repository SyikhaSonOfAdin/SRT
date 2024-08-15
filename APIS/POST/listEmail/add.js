const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const { listEmailInstance } = require('../../../src/modules/listEmail');
const SRT = require('../../../.conf/.conf_database');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LIST_EMAIL.ADD, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.LIST_EMAIL.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE), async (req, res) => {
    const { emailAddress } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!emailAddress) return res.status(403).json({ message: "Invalid parameters" })

    try {
        const CONNECTION = await SRT.getConnection()
        
        try {
            await CONNECTION.beginTransaction()

            await listEmailInstance.add(CONNECTION, companyId, emailAddress, userId)
            const DATA = await listEmailInstance.get(CONNECTION, companyId)

            await CONNECTION.commit()
            res.status(200).json({
                message: "Email added successfully",
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