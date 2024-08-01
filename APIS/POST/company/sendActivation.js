const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const jwt = require('jsonwebtoken');
const express = require('express');
const Security = require('../../../src/middleware/security');
const router = express.Router();

const security = new Security()

router.get(ENDPOINTS.GET.COMPANY.SEND_ACTIVATION, async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(401).json({
            message: "Invalid parameters"
        });
    }

    try {
        await security.EmailActivation(email)

        res.status(200).json({
            message: "Check your email for activation"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});

module.exports = router;
