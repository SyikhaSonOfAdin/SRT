const SRT = require("../../.conf/.conf_database")
const TABLES = require("../../.conf/.conf_tables")

class Location {
    add = async (companyId, userId, name) => {
        const CONNECTION =  await SRT.getConnection()
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_LOCATIONS.TABLE} (${TABLES.COMPANY_LOCATIONS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_LOCATIONS.COLUMN.INPUT_BY}, ${TABLES.COMPANY_LOCATIONS.COLUMN.NAME})
            VALUES (?,?,?)`
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

    delete = async (locationId) => {
        const CONNECTION =  await SRT.getConnection()
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


}

const locationInstance = new Location()

module.exports = { Location, locationInstance }