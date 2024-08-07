const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");

class Settings {
    add = async (companyId, inputBy, code) => {
        const CONNECTION = await SRT.getConnection();
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_SETTINGS.TABLE} (${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_SETTINGS.COLUMN.INPUT_BY}, ${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE})
            VALUES (?,?,?)`
        ]
        const PARAMS = [[companyId, inputBy, code]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    generateURL = async () => {
        const CONNECTION = await SRT.getConnection();
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_SETTINGS.TABLE} (${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_SETTINGS.COLUMN.INPUT_BY}, ${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE})
            VALUES (?,?,?)`
        ]
        const PARAMS = [[companyId, inputBy, code]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }
}

const settingsInstance = new Settings()
module.exports = {
    settingsInstance,
    Settings
}