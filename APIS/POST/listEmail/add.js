const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const Security = require('../../../src/middleware/security');
const express = require('express');
const { listEmailInstance } = require('../../../src/modules/listEmail');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LIST_EMAIL.ADD, security.verifyToken, security.verifyUser, async (req, res) => {
    const { email } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!email) return res.status(403).json({ message: "Invalid parameters" })
    
    try {
        await listEmailInstance.add(companyId, email, userId)
        res.status(200).json({
            message: "Email added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router