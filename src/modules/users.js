const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const Security = require("../middleware/security")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class Users {
    #security = new Security();

    add = async (CONNECTION, companyId, email, username, password, level) => {
        const QUERY = [
            `INSERT INTO ${TABLES.USER.TABLE} (${TABLES.USER.COLUMN.COMPANY_ID}, ${TABLES.USER.COLUMN.EMAIL}, ${TABLES.USER.COLUMN.USERNAME}, ${TABLES.USER.COLUMN.PASSWORD}, ${TABLES.USER.COLUMN.LEVEL})
            VALUES (?,?,?,?,?)`
        ]
        const PASSWORD = await bcrypt.hash(password, 13)
        const PARAMS = [[companyId, email, username, PASSWORD, level]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }    

    edit = async (CONNECTION, email, username, password, level, userId) => {
        const QUERY = [
            `UPDATE ${TABLES.USER.TABLE} SET ${TABLES.USER.COLUMN.EMAIL} = ?, ${TABLES.USER.COLUMN.USERNAME} = ?, ${TABLES.USER.COLUMN.PASSWORD} = ?, ${TABLES.USER.COLUMN.LEVEL} = ?
            WHERE ${TABLES.USER.COLUMN.ID} = ?`
        ]
        const PASSWORD = await bcrypt.hash(password, 13)
        const PARAMS = [[email, username, PASSWORD, level, userId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    delete = async (CONNECTION, userId) => {
        const QUERY = [
            `DELETE FROM ${TABLES.USER.TABLE} WHERE ${TABLES.USER.COLUMN.ID} = ?`
        ]
        const PARAMS = [[userId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }    

    get = async (CONNECTION, companyId) => {
        const QUERY = [
            `SELECT U.${TABLES.USER.COLUMN.ID}, U.${TABLES.USER.COLUMN.EMAIL}, U.${TABLES.USER.COLUMN.USERNAME}, DATE_FORMAT(U.${TABLES.USER.COLUMN.SINCE}, '%Y-%m-%d') AS SINCE, U.${TABLES.USER.COLUMN.LEVEL} 
            FROM ${TABLES.USER.TABLE} AS U WHERE U.${TABLES.USER.COLUMN.COMPANY_ID} = ?`
        ]
        const PARAMS = [[companyId]]

        try {
            const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
            return result
        } catch (error) {
            throw error
        }
    }

    isEmailExist = async (CONNECTION, email) => {
        const QUERY = [`SELECT ${TABLES.USER.COLUMN.EMAIL} FROM ${TABLES.USER.TABLE} WHERE ${TABLES.USER.COLUMN.EMAIL} = ?`]
        const PARAMS = [[email]]

        try {
            const [result] = await CONNECTION.query(QUERY[0], PARAMS[0])
            if (result.length > 0) {
                return true
            } else {
                return false
            }
        } catch (error) {
            throw error
        }
    }
}

const userInstance = new Users()
module.exports = {
    Users,
    userInstance
}