const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const { privilegesInstance } = require('../../../src/modules/privileges');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.USER.ADD, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.USER.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE), async (req, res) => {
    const { email, username, password, level, privileges } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId
    
    if (!email || !username || !password || !privileges) {
        return res.status(403).json({
            message: 'Invalid parameters'
        })
    }

    try {
        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()
        const isEmailExist = await userInstance.isEmailExist(CONNECTION, email)

        if (!isEmailExist) {

            const insertId = await userInstance.add(CONNECTION, companyId, email, username, password, level)
            await privilegesInstance.add(CONNECTION, insertId, privileges)
            await CONNECTION.commit()

            res.status(200).json({
                message: "User added successfully"
            })
        } else {
            await CONNECTION.rollback()
            res.status(403).json({
                message: "Email already used"
            })
        }
        CONNECTION.release()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;