const { reportInstance } = require('../../../src/modules/report');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();
const queues = new Map();

const security = new Security()

router.post(ENDPOINTS.POST.REPORT.EDIT, security.verifyToken, security.verifyUser, async (req, res) => {
    const { locationId, departmentId, categoryId, reportId } = req.body;
    const companyId = req.body.companyId

    const CONNECTION = await SRT.getConnection();

    const { default: PQueue } = await import('p-queue');

    if (!queues.has(companyId)) {
        queues.set(companyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(companyId);

    try {
        await queue.add(async () => {
            try {
                await reportInstance.edit(CONNECTION, locationId, departmentId, categoryId, reportId)
                res.status(200).json({ message: "Report edited" });
            } catch (error) {
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
