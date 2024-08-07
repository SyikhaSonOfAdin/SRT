const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const { Email } = require("./email");

class ListEmail extends Email {

    add = async (companyId, email, userId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `INSERT INTO ${TABLES.LIST_EMAIL.TABLE} (${TABLES.LIST_EMAIL.COLUMN.EMAIL}, ${TABLES.LIST_EMAIL.COLUMN.COMPANY_ID}, ${TABLES.LIST_EMAIL.COLUMN.INPUT_BY})
            VALUES (?,?,?)`
        ]
        const PARAMS = [[email, companyId, userId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    delete = async (emailId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `DELETE FROM ${TABLES.LIST_EMAIL.TABLE} WHERE ${TABLES.LIST_EMAIL.COLUMN.ID} = ?`
        ]
        const PARAMS = [[emailId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    edit = async (email, emailId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.LIST_EMAIL.TABLE} SET ${TABLES.LIST_EMAIL.COLUMN.EMAIL} = ? WHERE ${TABLES.LIST_EMAIL.COLUMN.ID} = ?`
        ]
        const PARAMS = [[email, emailId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    getEmails = async (CONNECTION, companyId) => {
        const QUERY = [
            `SELECT E.${TABLES.LIST_EMAIL.COLUMN.EMAIL} FROM ${TABLES.LIST_EMAIL.TABLE} AS E 
            JOIN ${TABLES.COMPANY.TABLE} AS C ON E.${TABLES.LIST_EMAIL.COLUMN.COMPANY_ID} = C.${TABLES.LIST_EMAIL.COLUMN.ID}
            WHERE C.${TABLES.COMPANY.COLUMN.ID} = ?`
        ]
        const PARAMS = [[companyId]]
        try {
            const [emails] = await CONNECTION.query(QUERY[0], PARAMS[0]);
            return emails
        } catch (error) {
            throw error
        }
    }

    notify = async (listEmail, subject, desc, html) => {
        if (!Array.isArray(listEmail)) {
            return new Error("List Email must be an array");
        }

        const emails = listEmail.map((rows) => { return rows.EMAIL }).join(', ');

        await this.sendEmail(emails, subject, desc, html)        
    }
}

const listEmailInstance = new ListEmail()

module.exports = {
    listEmailInstance,
    ListEmail
}