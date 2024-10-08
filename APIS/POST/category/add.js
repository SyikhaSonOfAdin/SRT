const { categoryInstance } = require('../../../src/modules/category');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.CATEGORY.ADD, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.LIST_CATEGORY.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE), async (req, res) => {
    const { categoryName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!categoryName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        const CONNECTION = await SRT.getConnection()
        try {
            await CONNECTION.beginTransaction()
            await categoryInstance.add(CONNECTION, companyId, userId, categoryName)
            const DATA = await categoryInstance.get(CONNECTION, companyId)
            await CONNECTION.commit()

            res.status(200).json({
                message: "Category added successfully",
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
            message: error.message,
        })
    }
})

module.exports = router