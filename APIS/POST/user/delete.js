const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.USER.DELETE, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.USER.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_DELETE), async (req, res) => {
    const { deletedUserId } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!deletedUserId) {
        return res.status(403).json({
            message: 'Invalid parameters deletedUserId'
        })
    }

    try {
        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()

        try {
            await userInstance.delete(CONNECTION, deletedUserId)
            await CONNECTION.commit()
            res.status(200).json({
                message: "User deleted successfully"
            })
        } catch (error) {
            await CONNECTION.rollback()
            res.status(403).json({
                message: "Email already used"
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