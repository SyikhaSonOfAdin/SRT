const SRT = require("../../.conf/.conf_database")
const TABLES = require("../../.conf/.conf_tables")

class Location {
    add = async (companyId, userId, name) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_LOCATIONS.TABLE} (${TABLES.COMPANY_LOCATIONS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_LOCATIONS.COLUMN.INPUT_BY}, ${TABLES.COMPANY_LOCATIONS.COLUMN.NAME}, ${TABLES.COMPANY_LOCATIONS.COLUMN.INPUT_DATE})
            VALUES (?,?,?, NOW())`
        ]
        const PARAMS = [[companyId, userId, name]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    edit = async (locationId, name) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.COMPANY_LOCATIONS.TABLE} SET ${TABLES.COMPANY_LOCATIONS.COLUMN.NAME} = ? WHERE ${TABLES.COMPANY_LOCATIONS.COLUMN.ID} = ? `
        ]
        const PARAMS = [[name, locationId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    delete = async (locationId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `DELETE FROM ${TABLES.COMPANY_LOCATIONS.TABLE} WHERE ${TABLES.COMPANY_LOCATIONS.COLUMN.ID} = ? `
        ]
        const PARAMS = [[locationId]]

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
            `SELECT CL.${TABLES.COMPANY_LOCATIONS.COLUMN.ID}, CL.${TABLES.COMPANY_LOCATIONS.COLUMN.NAME}, DATE_FORMAT(CL.${TABLES.COMPANY_LOCATIONS.COLUMN.INPUT_DATE}, '%Y-%m-%d') AS INPUT_DATE,
            U.${TABLES.USER.COLUMN.USERNAME} AS INPUT_BY
            FROM ${TABLES.COMPANY_LOCATIONS.TABLE} AS CL JOIN ${TABLES.USER.TABLE} AS U ON CL.${TABLES.COMPANY_LOCATIONS.COLUMN.INPUT_BY} = U.${TABLES.USER.COLUMN.ID}
            WHERE CL.${TABLES.COMPANY_LOCATIONS.COLUMN.COMPANY_ID} = ? `
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

const locationInstance = new Location()

module.exports = { Location, locationInstance }