const TABLES = require("../../.conf/.conf_tables");
const SRT = require("../../.conf/.conf_database");

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
        }
    }

    edit = async (CONNECTION, locationId, departmentId, categoryId, reportId) => {
        const QUERY = [
            `UPDATE ${TABLES.REPORT.TABLE} SET ${TABLES.REPORT.COLUMN.LOCATION_ID} = ?, ${TABLES.REPORT.COLUMN.DEPARTMENT_ID} = ?, 
            ${TABLES.REPORT.COLUMN.CATEGORY_ID} = ? WHERE ${TABLES.REPORT.COLUMN.ID} = ?`
        ]
        const PARAMS = [[locationId, departmentId, categoryId, reportId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    get = async (companyId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [`
            SELECT R.${TABLES.REPORT.COLUMN.ID}, R.${TABLES.REPORT.COLUMN.TICKET}, R.${TABLES.REPORT.COLUMN.INPUT_BY} AS REPORT_BY, CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.NAME} AS DEPARTMENT,
            CL.${TABLES.COMPANY_LOCATIONS.COLUMN.NAME} AS LOCATION, DATE_FORMAT(R.${TABLES.REPORT.COLUMN.INPUT_DATE}, '%Y-%m-%d') AS INPUT_DATE,
            COALESCE(DATE_FORMAT(RD.${TABLES.REPORT_DETAIL.COLUMN.FINISH_DATE}, '%Y-%m-%d'), '-') AS FINISH_DATE, R.${TABLES.REPORT.COLUMN.REPORT_ISSUE} AS REPORT_ISSUE,
            U.${TABLES.USER.COLUMN.USERNAME} AS ASSIGNED_TO, R.${TABLES.REPORT.COLUMN.STATUS} AS STATUS,
            RD.${TABLES.REPORT_DETAIL.COLUMN.RESULT} AS RESULT,
            RD.${TABLES.REPORT_DETAIL.COLUMN.PROBLEMS} AS PROBLEM,
            RD.${TABLES.REPORT_DETAIL.COLUMN.SOLUTIONS} AS SOLUTION
            FROM ${TABLES.REPORT.TABLE} AS R 
            LEFT JOIN ${TABLES.REPORT_DETAIL.TABLE} AS RD ON R.${TABLES.REPORT.COLUMN.ID} = RD.${TABLES.REPORT_DETAIL.COLUMN.REPORT_ID}
            LEFT JOIN ${TABLES.USER.TABLE} AS U ON RD.${TABLES.REPORT_DETAIL.COLUMN.ASSIGNED_USER} = U.${TABLES.USER.COLUMN.ID}
            JOIN ${TABLES.COMPANY_DEPARTMENTS.TABLE} AS CD ON R.${TABLES.REPORT.COLUMN.DEPARTMENT_ID} = CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID}
            JOIN ${TABLES.COMPANY_LOCATIONS.TABLE} AS CL ON R.${TABLES.REPORT.COLUMN.LOCATION_ID} = CL.${TABLES.COMPANY_LOCATIONS.COLUMN.ID}
            JOIN ${TABLES.COMPANY.TABLE} AS C ON CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID}
            WHERE C.${TABLES.COMPANY.COLUMN.ID} = ?
            `
        ]
        const PARAMS = [[companyId]]

        try {
            const [DATA] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return DATA
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    generateTicketNo = async (CONNECTION, companyId, companyCode) => {
        const QUERY = [
            `SELECT R.${TABLES.REPORT.COLUMN.TICKET} FROM ${TABLES.REPORT.TABLE} AS R
            JOIN ${TABLES.COMPANY_DEPARTMENTS.TABLE} AS CD ON R.${TABLES.REPORT.COLUMN.DEPARTMENT_ID} = CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID}
            JOIN ${TABLES.COMPANY.TABLE} AS C ON CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID}
            WHERE C.${TABLES.COMPANY.COLUMN.ID} = ?
            ORDER BY R.${TABLES.REPORT.COLUMN.ID} DESC LIMIT 1`
        ]
        const PARAMS = [[companyId]]

        try {
            const [rows] = await CONNECTION.query(QUERY[0], PARAMS[0]);

            let lastTicket = rows.length ? rows[0].TICKET : null;
            let newTicketNumber;

            if (lastTicket) {
                const lastNumber = parseInt(lastTicket.split('-')[1], 10);
                newTicketNumber = lastNumber + 1;
            } else {
                newTicketNumber = 1;
            }

            const ticketNo = `${companyCode}-${String(newTicketNumber).padStart(4, '0')}`;

            return ticketNo;
        } catch (error) {
            throw error
        }
    }

    updateStatus = async (CONNECTION, reportId) => {
        const QUERY = [`UPDATE ${TABLES.REPORT.TABLE} SET ${TABLES.REPORT.COLUMN.STATUS} = "IN PROGRESS" WHERE ${TABLES.REPORT.COLUMN.ID} = ?`]
        const PARAMS = [[reportId]]
        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }
}

const reportInstance = new Report()
module.exports = {
    reportInstance,
    Report
}