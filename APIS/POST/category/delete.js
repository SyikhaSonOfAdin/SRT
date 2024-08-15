const { categoryInstance } = require('../../../src/modules/category');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.CATEGORY.DELETE, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.LIST_CATEGORY.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_DELETE), async (req, res) => {
    const { categoryId } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!categoryId) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await categoryInstance.delete(categoryId)
        res.status(200).json({
            message: "Category deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router