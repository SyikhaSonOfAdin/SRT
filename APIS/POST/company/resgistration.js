const companyInstance = require('../../../src/modules/company');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const router = express.Router();

router.post(ENDPOINTS.POST.COMPANY.REGISTRATION, async (req, res) => {
    const { email, password, name, privileges } = req.body;

    if (!email || !password || !name || !privileges) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    try {
        await companyInstance.registration(email, password, name, privileges)
        res.status(200).json({
            message: "Check your email for confirmation"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router