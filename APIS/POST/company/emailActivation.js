const companyInstance = require('../../../src/modules/company');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.get(ENDPOINTS.GET.COMPANY.CONFIRMATION, async (req, res) => {

    if (!req.params.passId || !req.query.token) {
        return res.status(401).json({
            message: "Invalid parameters"
        });
    }

    try {
        const token = req.query.token;

        if (!token) {
            return res.status(401).send("JWT must be provided")
        }

        jwt.verify(token, process.env.SECRET_KEY);
        await companyInstance.companyActivation(req.params.passId)

        res.status(200).send("Registration successful")
    } catch (error) {
        res.status(500).send(error.message)
    }
});

module.exports = router;
