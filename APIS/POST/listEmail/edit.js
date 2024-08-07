const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const { listEmailInstance } = require('../../../src/modules/listEmail');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LIST_EMAIL.EDIT, security.verifyToken, security.verifyUser, async (req, res) => {
    const { email, emailId } = req.body

    if (!email || !emailId) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await listEmailInstance.edit(email, emailId)
        res.status(200).json({
            message: "Email edited successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router