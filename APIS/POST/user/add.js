const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.USER.ADD, security.verifyToken, security.verifyUser, async (req, res) => {
    const { email, username, password, level } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!email || !username || !password) {
        return res.status(403).json({
            message: 'Invalid parameters'
        })
    }

    try {
        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()
        const isEmailExist = await userInstance.isEmailExist(CONNECTION, email)
        if (!isEmailExist) {
            await userInstance.add(CONNECTION, companyId, email, username, password, level)
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

router.post(ENDPOINTS.POST.USER.ADD_BY_COMPANY, security.verifyToken, async (req, res) => {
    const { companyId, email, username, password, level } = req.body

    if (!companyId || !email || !username || !password) {
        return res.status(403).json({
            message: 'Invalid parameters'
        })
    }

    try {
        const decryptedCompanyId = security.decrypt(companyId)

        if (!decryptedCompanyId) return res.status(403).json({ message: 'Invalid parameters' })

        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()
        const isEmailExist = await userInstance.isEmailExist(CONNECTION, email)
        if (!isEmailExist) {
            await userInstance.add(CONNECTION, decryptedCompanyId, email, username, password, level)
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