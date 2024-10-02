const { reportInstance } = require('../../../src/modules/report');
const Security = require('../../../src/middleware/security');
const ENDPOINTS = require('../../../.conf/.conf_endpoints');
const express = require('express');
const exceljs = require('exceljs');
const router = express.Router();

const security = new Security()

router.get(ENDPOINTS.GET.DOWNLOAD.REPORT, security.verifyToken, async (req, res) => {
    const companyId = security.decrypt(req.params.companyId)

    if (!companyId) return res.status(400).json({message: "Invalid parameters"})    

    try {
        const DATA = await reportInstance.get(companyId)
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // Definisikan header sesuai kebutuhan
        const headers = ['Ticket No', 'Submit Date', 'Category', 'PIC', 'Message', 'Assigned To', 'Finish Date', 'Status', 'Result', 'Problem', 'Solution']; // Gantilah dengan header yang sesuai

        // Tambahkan header ke worksheet
        worksheet.addRow(headers);

        DATA.forEach((row) => {
            worksheet.addRow([row.TICKET, row.INPUT_DATE, row.CATEGORY, `${row.REPORT_BY}/${row.DEPARTMENT}/${row.LOCATION}`, row.REPORT_ISSUE, row.ASSIGNED_TO, row.FINISH_DATE, row.STATUS,
                row.RESULT, row.PROBLEM, row.SOLUTION
            ]);
        });


        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router