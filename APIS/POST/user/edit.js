const { userInstance } = require('../../../src/modules/users');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.USER.EDIT, security.verifyToken, security.verifyUser, async (req, res) => {
    const { email, username, password, level } = req.body
    const userId = req.body.userId

    if (!email || !username || !password || !level) return res.status(403).json({ message: 'Invalid parameters' })

    try {
        const CONNECTION = await SRT.getConnection()

        await CONNECTION.beginTransaction()

        await userInstance.edit(CONNECTION, email, username, password, level, userId)

        await CONNECTION.commit()

        res.status(200).json({
            message: "Edited"
        })
        CONNECTION.release()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;