const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const Security = require("../middleware/security")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { userInstance } = require("./users");
const { privilegesInstance } = require("./privileges");

class Company {
    #security = new Security();

    companyActivation = async (passId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.COMPANY.TABLE} SET ${TABLES.COMPANY.COLUMN.STATUS} = "ACTIVE" WHERE ${TABLES.COMPANY.COLUMN.PASS_ID} = ?`
        ]
        const PARAMS = [[passId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    getCompanyCode = async (companyId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `SELECT CS.${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_CODE} FROM ${TABLES.COMPANY_SETTINGS.TABLE} AS CS
            JOIN ${TABLES.COMPANY.TABLE} AS C ON CS.${TABLES.COMPANY_SETTINGS.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID}
            WHERE C.${TABLES.COMPANY.COLUMN.ID} = ?`
        ]
        const PARAMS = [[companyId]]

        try {
            const [companyCode] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return companyCode[0].COMPANY_CODE ? companyCode[0].COMPANY_CODE : null
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    registration = async (email, password, name, privileges) => {
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
                await CONNECTION.beginTransaction()
                const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
                const lastInsertId = result.insertId;

                const userId = await userInstance.add(CONNECTION, lastInsertId, email, name, password, 3);
                await privilegesInstance.add(CONNECTION, userId, privileges)
                await this.#security.EmailActivationLink(email, PASS_ID)
                await CONNECTION.commit()

            } else {
                throw new Error("Email already exists!")
            }
        } catch (error) {
            CONNECTION.rollback()
            throw error
        } finally {
            CONNECTION.release()
        }
    }


}
const companyInstance = new Company()
module.exports = companyInstance