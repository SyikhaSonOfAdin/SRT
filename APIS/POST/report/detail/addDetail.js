const { reportDetailInstance } = require('../../../../src/modules/reportDetail');
const { reportInstance } = require('../../../../src/modules/report');
const Security = require('../../../../src/middleware/security');
const ENDPOINTS = require('../../../../.conf/.conf_endpoints');
const SRT = require('../../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();
const queues = new Map();

const security = new Security();

router.post(ENDPOINTS.POST.REPORT.ADD_DETAIL, security.verifyToken, security.verifyUser, async (req, res) => {
    const { reportId, status, finishDate, result, problem, solution } = req.body;
    const companyId = req.body.companyId
    
    if (!reportId || !finishDate || !status) {
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

            await reportDetailInstance.addDetail(CONNECTION, result, problem, solution, finishDate, reportId);
            await reportInstance.updateStatus(CONNECTION, status, reportId)

            await CONNECTION.commit();
            res.status(200).json({ message: "Added successfully!" });
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
