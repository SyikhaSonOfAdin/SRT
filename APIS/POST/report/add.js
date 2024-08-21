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

router.post(ENDPOINTS.POST.REPORT.ADD, async (req, res) => {
    const { companyId, locationId, departmentId, categoryId, inputBy, reportIssued } = req.body;

    if (!companyId) return res.status(400).json({ message: 'Invalid parameters' })

    let decryptedCompanyId 
    try {
        decryptedCompanyId = security.decrypt(companyId)
        if (!decryptedCompanyId) return res.status(400).json({ message: 'Invalid companyId' })
    } catch (error) {
        console.log('Decryption error:', error.message);
        return res.status(500).json({ message: error.message });
    }
    

    const CONNECTION = await SRT.getConnection();

    const { default: PQueue } = await import('p-queue');

    if (!queues.has(decryptedCompanyId)) {
        queues.set(decryptedCompanyId, new PQueue({ concurrency: 1 }));
    }

    const queue = queues.get(decryptedCompanyId);

    await queue.add(async () => {
        try {
            await CONNECTION.beginTransaction();

            const today = new Date().toISOString().split('T')[0];
            const companyCode = await companyInstance.getCompanyCode(decryptedCompanyId);
            const ticketNo = await reportInstance.generateTicketNo(CONNECTION, decryptedCompanyId, companyCode);
            await reportInstance.add(CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued);
            const listEmail = await listEmailInstance.getEmails(CONNECTION, decryptedCompanyId)

            await listEmailInstance.notify(listEmail, `New Report! ${ticketNo}`, "", `<p><b>Ticket</b> : ${ticketNo}<br><b>Date</b> : ${today}<br><b>By</b> : ${inputBy}</p><p><b>Message</b> :<br>${reportIssued}</p>`);

            await CONNECTION.commit();
            res.status(200).json({ message: `Report ${ticketNo} submitted` });
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
