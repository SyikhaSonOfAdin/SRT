const { listEmailInstance } = require('../../../src/modules/listEmail');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const { departmentInstance } = require('../../../src/modules/department');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.DEPARTMENT.ADD, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.COMPANY_DEPARTMENTS.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE), async (req, res) => {
    const { departmentName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!departmentName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await departmentInstance.add(companyId, userId, departmentName)
        res.status(200).json({
            message: "Department added successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router