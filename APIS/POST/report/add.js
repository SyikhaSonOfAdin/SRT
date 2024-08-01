const SRT = require('../../../.conf/.conf_database');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const reportInstance = require('../../../src/modules/report');
const express = require('express');
const PQueue = require('p-queue');
const router = express.Router();
const queues = new Map();

router.post(ENDPOINTS.POST.REPORT.ADD, async (req, res) => {
    const { companyId, locationId, departmentId, categoryId, inputBy, reportIssued } = req.body

    if (!companyId) {
        res.status(400).json({
            message: "Invalid parameters"
        })
    }

    if (!queues.has(companyId)) {
        queues.set(companyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(companyId);

    try {
        
        const CONNECTION = await SRT.getConnection()
        await CONNECTION.beginTransaction()
        await queue.add(async () => {
            const ticketNo = await reportInstance.generateTicketNo(CONNECTION, companyId)
            await reportInstance.add(CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued)
        })
        await CONNECTION.commit()
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router