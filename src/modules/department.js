const SRT = require("../../.conf/.conf_database")
const TABLES = require("../../.conf/.conf_tables")

class Department {
    add = async (companyId, userId, departmentName) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_DEPARTMENTS.TABLE} (${TABLES.COMPANY_DEPARTMENTS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_DEPARTMENTS.COLUMN.INPUT_BY}, 
            ${TABLES.COMPANY_DEPARTMENTS.COLUMN.NAME}) VALUES (?,?,?)`
        ]
        const PARAMS = [[companyId, userId, departmentName]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    edit = async (departmentId, name) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.COMPANY_DEPARTMENTS.TABLE} SET ${TABLES.COMPANY_DEPARTMENTS.COLUMN.NAME} = ? WHERE ${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID} = ? `
        ]
        const PARAMS = [[name, departmentId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    delete = async (departmentId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `DELETE FROM ${TABLES.COMPANY_DEPARTMENTS.TABLE} WHERE ${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID} = ? `
        ]
        const PARAMS = [[departmentId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    get = async (companyId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `SELECT CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.ID}, CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.NAME}, DATE_FORMAT(CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.INPUT_DATE}, '%Y-%m-%d') AS INPUT_DATE,
            U.${TABLES.USER.COLUMN.USERNAME} AS INPUT_BY
            FROM ${TABLES.COMPANY_DEPARTMENTS.TABLE} AS CD JOIN ${TABLES.USER.TABLE} AS U ON CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.INPUT_BY} = U.${TABLES.USER.COLUMN.ID}
            WHERE CD.${TABLES.COMPANY_DEPARTMENTS.COLUMN.COMPANY_ID} = ? `
        ]
        const PARAMS = [[companyId]]

        try {
            const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return result
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }
}

const departmentInstance = new Department()
module.exports = {
    departmentInstance,
    Department
}