const { reportDetailInstance } = require('../../../../src/modules/reportDetail');
const { reportInstance } = require('../../../../src/modules/report');
const Security = require('../../../../src/middleware/security');
const ENDPOINTS = require('../../../../.conf/.conf_endpoints');
const SRT = require('../../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();
const queues = new Map();

const security = new Security()

router.post(ENDPOINTS.POST.REPORT.ASSIGN, security.verifyToken, security.verifyUser, async (req, res) => {
    const { reportId } = req.body;
    const companyId = req.body.companyId
    const userId = req.body.userId

    if (!reportId) {
        return res.status(400).json({ message: "Invalid parameters" });
    }

    const CONNECTION = await SRT.getConnection();

    const { default: PQueue } = await import('p-queue');

    if (!queues.has(companyId)) {
        queues.set(companyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(companyId);

    await queue.add(async () => {
        try {
            await CONNECTION.beginTransaction();

            const isExist = await reportDetailInstance.isExist(CONNECTION, reportId);

            if (isExist) {
                await CONNECTION.rollback()
                return res.status(409).json({ message: "Already assigned to other user" });
            }

            await reportDetailInstance.assign(CONNECTION, userId, reportId)
            await reportInstance.updateStatus(CONNECTION, "IN PROGRESS", reportId)

            await CONNECTION.commit();
            res.status(200).json({ message: "Assigned" });
        } catch (error) {
            await CONNECTION.rollback();
            res.status(500).json({ message: error.message });
        } finally {
            CONNECTION.release();
        }
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
});

module.exports = router;
