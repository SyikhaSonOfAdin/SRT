const { categoryInstance } = require('../../../src/modules/category');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const TABLES = require('../../../.conf/.conf_tables');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.CATEGORY.EDIT, security.verifyToken, security.verifyUser, security.verifyPrivilege(TABLES.LIST_CATEGORY.TABLE, TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE), async (req, res) => {
    const { categoryId, categoryName } = req.body
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!categoryId || !categoryName) return res.status(403).json({ message: "Invalid parameters" })

    try {
        await categoryInstance.edit(categoryId, categoryName)
        res.status(200).json({
            message: "Category edited successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

module.exports = router