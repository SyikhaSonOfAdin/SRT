const Security = require('../../src/middleware/security');
const ENDPOINTS = require('../../.conf/.conf_endpoints');
const express = require('express');
const router = express.Router();

const security = new Security()

router.post(ENDPOINTS.POST.LOGIN, async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await security.login(email, password)
        users.status === false ? res.status(403).json({message : users.message}) : res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router