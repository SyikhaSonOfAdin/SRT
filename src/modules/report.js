const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");

class Report {
    add = async (CONNECTION, locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued) => {
        const QUERY = [
            `INSERT INTO ${TABLES.REPORT.TABLE} (${TABLES.REPORT.COLUMN.LOCATION_ID}, ${TABLES.REPORT.COLUMN.DEPARTMENT_ID}, 
            ${TABLES.REPORT.COLUMN.CATEGORY_ID}, ${TABLES.REPORT.COLUMN.TICKET}, ${TABLES.REPORT.COLUMN.INPUT_BY}, 
            ${TABLES.REPORT.COLUMN.REPORT_ISSUE}) VALUES (?,?,?,?,?,?)`
        ]
        const PARAMS = [[locationId, departmentId, categoryId, ticketNo, inputBy, reportIssued]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    get = async (companyId) => {

    }

    generateTicketNo = async (CONNECTION, companyId) => {
        const QUERY = [
            `SELECT R.${TABLES.REPORT.COLUMN.TICKET} FROM ${TABLES.REPORT.TABLE} AS R
            JOIN ${TABLES.COMPANY_DEPARTMENTS.TABLE} AS CD ON R.${TABLES.REPORT.COLUMN.DEPARTMENT_ID} = CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID}
            JOIN ${TABLES.COMPANY.TABLE} AS C ON CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID}
            ORDER BY R.${TABLES.REPORT.COLUMN.ID} DESC LIMIT 1`
        ]
        const PARAMS = [[companyId]]

        try {
            const [rows] = await CONNECTION.query(QUERY[0], PARAMS[0]);

            let lastTicket = rows.length ? rows[0].ticket : null;
            let newTicketNumber;

            if (lastTicket) {
                const lastNumber = parseInt(lastTicket.split('-')[1], 10);
                newTicketNumber = lastNumber + 1;
            } else {
                newTicketNumber = 1;
            }

            const ticketNo = `KKH-${String(newTicketNumber).padStart(4, '0')}`;

            return ticketNo;
        } catch (error) {
            throw error
        }
    }
}

const reportInstance = new Report()
module.exports = reportInstance