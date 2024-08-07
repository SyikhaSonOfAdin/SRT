const { categoryInstance } = require('../../../src/modules/category');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.CATEGORY.ADD, security.verifyToken, security.verifyUser, async (req, res) => {
    const { categoryName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!categoryName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await categoryInstance.add(companyId, userId, categoryName)
        res.status(200).json({
            message: "Category added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router