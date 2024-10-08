const TABLES = require("../../.conf/.conf_tables");
const { Report } = require("./report");

class ReportDetail extends Report {
    assign = async (CONNECTION, assignedTo, reportId) => {
        const QUERY = [`
            INSERT INTO ${TABLES.REPORT_DETAIL.TABLE} (${TABLES.REPORT_DETAIL.COLUMN.ASSIGNED_USER}, ${TABLES.REPORT_DETAIL.COLUMN.REPORT_ID})
            VALUES (?,?)`
        ]
        const PARAMS = [[assignedTo, reportId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    isExist = async (CONNECTION, reportId) => {
        const QUERY = [`
            SELECT 1 FROM ${TABLES.REPORT_DETAIL.TABLE} WHERE ${TABLES.REPORT_DETAIL.COLUMN.REPORT_ID} = ?`
        ]
        const PARAMS = [[reportId]]

        try {
            const [isExist] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return isExist.length ? true : false
        } catch (error) {
            throw error
        }
    }

    addDetail = async (CONNECTION, result, problem, solution, finishDate, reportId) => {
        const QUERY = [`
            UPDATE ${TABLES.REPORT_DETAIL.TABLE} 
            SET ${TABLES.REPORT_DETAIL.COLUMN.RESULT} = ?, 
            ${TABLES.REPORT_DETAIL.COLUMN.PROBLEMS} = ?, 
            ${TABLES.REPORT_DETAIL.COLUMN.SOLUTIONS} = ?,
            ${TABLES.REPORT_DETAIL.COLUMN.FINISH_DATE} = ?
            WHERE ${TABLES.REPORT_DETAIL.COLUMN.REPORT_ID} = ?`
        ]
        const PARAMS = [[result, problem, solution, finishDate, reportId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }
}

const reportDetailInstance = new ReportDetail()
module.exports = {
    Detail: ReportDetail,
    reportDetailInstance
}