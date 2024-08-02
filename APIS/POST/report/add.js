const { listEmailInstance } = require('../../../src/modules/listEmail');
const { reportInstance } = require('../../../src/modules/report');
const companyInstance = require('../../../src/modules/company');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const SRT = require('../../../.conf/.conf_database');
const express = require('express');
const router = express.Router();
const queues = new Map();

const security = new Security()

router.post(ENDPOINTS.POST.REPORT.ADD, security.verifyToken, security.verifyUser, async (req, res) => {
    const { locationId, departmentId, categoryId, inputBy, reportIssued } = req.body;
    const companyId = req.body.companyId
    
    const CONNECTION = await SRT.getConnection();

    const { default: PQueue } = await import('p-queue');

    if (!queues.has(companyId)) {
        queues.set(companyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(companyId);

    await queue.add(async () => {
        try {
            await CONNECTION.beginTransaction();

            const today = new Date().toISOString().split('T')[0];
            const companyCode = await companyInstance.getCompanyCode(companyId);
            const ticketNo = await reportInstance.generateTicketNo(CONNECTION, companyId, companyCode);
            await reportInstance.add(CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued);
            const listEmail = await listEmailInstance.getEmails(CONNECTION, companyId)

            await listEmailInstance.notify(listEmail, "New Report!", "", `<h3>Ticket No : ${ticketNo}<br>By ${inputBy}<br>${today}</h3><p>${reportIssued}</p>`);

            await CONNECTION.commit();
            res.status(200).json({ message: `Report submitted`, ticket: ticketNo });
        } catch (error) {
            await CONNECTION.rollback();
            res.status(500).json({ message: error.message });
        } finally {
            CONNECTION.release();
        }
    }).catch((error) => {
        res.status(500).json({ message: error.message });
    })
});

module.exports = router;
