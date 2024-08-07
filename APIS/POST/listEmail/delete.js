const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const { listEmailInstance } = require('../../../src/modules/listEmail');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LIST_EMAIL.DELETE, security.verifyToken, security.verifyUser, async (req, res) => {
    const { emailId } = req.body

    if (!emailId) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await listEmailInstance.delete(emailId)
        res.status(200).json({
            message: "Email deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router