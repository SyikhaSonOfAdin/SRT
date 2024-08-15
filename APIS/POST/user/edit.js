const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const { privilegesInstance } = require('../../../src/modules/privileges');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.USER.EDIT, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.USER.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE), async (req, res) => {
    const { uId, eAddr, uName, privileges } = req.body
    const userId = req.body.userId

    if (!uId || !eAddr || !uName || !privileges) return res.status(403).json({ message: 'Invalid parameters' })

    try {
        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()

        await userInstance.edit(CONNECTION, eAddr, uName, uId)
        await privilegesInstance.edit(CONNECTION, uId, privileges)

        await CONNECTION.commit()

        res.status(200).json({
            message: "User Edited"
        })
        CONNECTION.release()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;