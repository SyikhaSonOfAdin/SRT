const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const jwt = require('jsonwebtoken');
const Security = require("../middleware/security");

class Settings {
    #security

    constructor() {
        this.#security = new Security()
    }

    add = async (CONNECTION, companyId, inputBy, code) => {
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY_SETTINGS.TABLE} (${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_ID}, ${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE}, ${TABLES.COMPANY_SETTINGS.COLUMN.URL})
            VALUES (?,?,?) ON DUPLICATE KEY UPDATE
            ${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE} = VALUES(${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE}),
            ${TABLES.COMPANY_SETTINGS.COLUMN.URL} = VALUES(${TABLES.COMPANY_SETTINGS.COLUMN.URL})`
        ]
        const url = this.generateURL(companyId, code)
        const PARAMS = [[companyId, code, url]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    generateURL = (companyId) => {
        try {
            // Pastikan enkripsi berjalan dengan benar dan menghasilkan string yang valid
            const encryptedCompanyId = this.#security.encrypt(companyId);
            if (!encryptedCompanyId) {
                throw new Error('Encryption failed');
            }

            // Gunakan URLSearchParams dengan benar
            const cId = new URLSearchParams({ cId: encryptedCompanyId }).toString();
            const url = `${process.env?.URL_APP}/report/p?${cId}`;
            return url;
        } catch (error) {
            console.error('Error generating URL:', error);
            throw error;
        }
    };


    get = async (CONNECTION, companyId) => {
        const QUERY = [
            `SELECT CS.* FROM ${TABLES.COMPANY_SETTINGS.TABLE} AS CS WHERE CS.${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_ID} = ?`
        ]
        const PARAMS = [[companyId]]

        try {
            const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return result
        } catch (error) {
            throw error
        }
    }
}

const settingsInstance = new Settings()
module.exports = {
    settingsInstance,
    Settings
}