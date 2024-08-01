const reportInstance = require('../../../src/modules/report');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const companyInstance = require('../../../src/modules/company');
const router = express.Router();
const queues = new Map();

router.post(ENDPOINTS.POST.REPORT.EDIT, async (req, res) => {
    const { companyId, locationId, departmentId, categoryId, inputBy, reportIssued } = req.body;

    if (!companyId) {
        return res.status(400).json({ message: "Invalid parameters" });
    }

    const CONNECTION = await SRT.getConnection();

    const { default: PQueue } = await import('p-queue');

    if (!queues.has(companyId)) {
        queues.set(companyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(companyId);

    try {
        await queue.add(async () => {
            await CONNECTION.beginTransaction();            
            await reportInstance.add(CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued);
            await CONNECTION.commit();
            res.status(200).json({ message: "Report edited" });
        });
    } catch (error) {
        await CONNECTION.rollback();
        res.status(500).json({ message: error.message });
    } finally {
        CONNECTION.release();
    }
});

module.exports = router;
