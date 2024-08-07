const { departmentInstance } = require('../../../src/modules/department');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.DEPARTMENT.DELETE, security.verifyToken, security.verifyUser, async (req, res) => {
    const { departmentId } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!departmentId) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await departmentInstance.delete(departmentId)
        res.status(200).json({
            message: "Department deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router