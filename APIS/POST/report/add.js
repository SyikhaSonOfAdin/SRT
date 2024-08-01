const companyInstance = require('../../../src/modules/company');
const { reportInstance } = require('../../../src/modules/report');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();
const queues = new Map();

const security = new Security()

router.post(ENDPOINTS.POST.REPORT.ADD, security.verifyToken, async (req, res) => {
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
            try {
                const companyCode = await companyInstance.getCompanyCode(companyId);
                const ticketNo = await reportInstance.generateTicketNo(CONNECTION, companyId, companyCode);
                await reportInstance.add(CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued);
                await CONNECTION.commit();
                res.status(200).json({ message: "Report submitted" });
            } catch (error) {
                await CONNECTION.rollback();
                res.status(500).json({ message: error.message });
            } finally {
                CONNECTION.release();
            }
        });
    } catch (error) {
        await CONNECTION.rollback();
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
