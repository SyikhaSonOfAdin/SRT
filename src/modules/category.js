const TABLES = require("../../.conf/.conf_tables")
const SRT = require("../../.conf/.conf_database")

class Category {
    add = async (CONNECTION, companyId, userId, name) => {
        const QUERY = [
            `INSERT INTO ${TABLES.LIST_CATEGORY.TABLE} (${TABLES.LIST_CATEGORY.COLUMN.COMPANY_ID}, ${TABLES.LIST_CATEGORY.COLUMN.INPUT_BY}, ${TABLES.LIST_CATEGORY.COLUMN.NAME})
            VALUES (?,?,?)`
        ]
        const PARAMS = [[companyId, userId, name]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        }
    }

    edit = async (categoryId, name) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `UPDATE ${TABLES.LIST_CATEGORY.TABLE} SET ${TABLES.LIST_CATEGORY.COLUMN.NAME} = ? WHERE ${TABLES.LIST_CATEGORY.COLUMN.ID} = ? `
        ]
        const PARAMS = [[name, categoryId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    delete = async (categoryId) => {
        const CONNECTION = await SRT.getConnection()
        const QUERY = [
            `DELETE FROM ${TABLES.LIST_CATEGORY.TABLE} WHERE ${TABLES.LIST_CATEGORY.COLUMN.ID} = ? `
        ]
        const PARAMS = [[categoryId]]

        try {
            await CONNECTION.query(QUERY[0], PARAMS[0])
        } catch (error) {
            throw error
        } finally {
            CONNECTION.release()
        }
    }

    get = async (CONNECTION, companyId) => {
        const QUERY = [
            `SELECT LC.${TABLES.LIST_CATEGORY.COLUMN.ID}, LC.${TABLES.LIST_CATEGORY.COLUMN.NAME}, DATE_FORMAT(LC.${TABLES.LIST_CATEGORY.COLUMN.INPUT_DATE}, '%Y-%m-%d') AS INPUT_DATE,
            U.${TABLES.USER.COLUMN.USERNAME} AS INPUT_BY
            FROM ${TABLES.LIST_CATEGORY.TABLE} AS LC JOIN ${TABLES.USER.TABLE} AS U ON LC.${TABLES.LIST_CATEGORY.COLUMN.INPUT_BY} = U.${TABLES.USER.COLUMN.ID}
            WHERE LC.${TABLES.LIST_CATEGORY.COLUMN.COMPANY_ID} = ? `
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

const categoryInstance = new Category()
module.exports = {
    categoryInstance,
    Category
}