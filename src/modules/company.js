const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const Security = require("../middleware/security")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class Company {
    #security = new Security();

    registration = async (email, password, name) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `INSERT INTO ${TABLES.COMPANY.TABLE} 
            (${TABLES.COMPANY.COLUMN.EMAIL}, ${TABLES.COMPANY.COLUMN.PASSWORD}, ${TABLES.COMPANY.COLUMN.NAME}, ${TABLES.COMPANY.COLUMN.PASS_ID})
            VALUES (?,?,?,?)`
        ]

        try {
            const isEmailExist = await this.#security.isEmailExist(email)
            if (!isEmailExist) {
                const PASS_ID = uuidv4()
                const PASSWORD = await bcrypt.hash(password, 13)
                const PARAMS = [[email, PASSWORD, name, PASS_ID]]

                await CONNECTION.query(QUERY[0], PARAMS[0])
                await this.#security.EmailActivation(email)
            } else {
                throw new Error("Email already exists!")
            }
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    companyActivation = async (passId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.COMPANY.TABLE} SET ${TABLES.COMPANY.COLUMN.STATUS} = "ACTIVE" WHERE ${TABLES.COMPANY.COLUMN.PASS_ID} = ?`
        ]

        try {
            const PARAMS = [[passId]]
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }
}
const COMPANY = new Company()
module.exports = COMPANY