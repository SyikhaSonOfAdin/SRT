const { reportDetailInstance } = require('../../../src/modules/reportDetail');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const { reportInstance } = require('../../../src/modules/report');
const router = express.Router();
const queues = new Map();

const security = new Security()

router.post(ENDPOINTS.POST.REPORT.ASSIGN, security.verifyToken, async (req, res) => {
    const { companyId, userId, reportId } = req.body;

    if (!companyId || !userId || !reportId) {
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
            try {
                await CONNECTION.beginTransaction();

                const isExist = await reportDetailInstance.isExist(CONNECTION, reportId);

                if (isExist) {
                    await CONNECTION.rollback()
                    return res.status(409).json({ message: "Already assigned to other user" });
                }

                await reportDetailInstance.assign(CONNECTION, userId, reportId)
                await reportInstance.updateStatus(CONNECTION, reportId)
                
                res.status(200).json({ message: "Assigned" });
                await CONNECTION.commit()
            } catch (error) {
                await CONNECTION.rollback()
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
