const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");
const Security = require("../middleware/security")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class Users {
    #security = new Security();

    add = async (CONNECTION, companyId, email, username, password, level) => {
        const QUERY = `
            INSERT INTO ${TABLES.USER.TABLE} 
            (${TABLES.USER.COLUMN.ID}, ${TABLES.USER.COLUMN.COMPANY_ID}, ${TABLES.USER.COLUMN.EMAIL}, ${TABLES.USER.COLUMN.USERNAME}, ${TABLES.USER.COLUMN.PASSWORD}, ${TABLES.USER.COLUMN.LEVEL})
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const userId = uuidv4()
        const PASSWORD_HASH = await bcrypt.hash(password, 13);
        const PARAMS = [userId, companyId, email, username, PASSWORD_HASH, level];

        try {
            const [result] = await CONNECTION.query(QUERY, PARAMS);
            return userId // Mengembalikan ID dari user yang baru ditambahkan
        } catch (error) {
            console.error("Error inserting new user:", error);
            throw new Error("Failed to add new user. Please try again.");
        }
    };

    edit = async (CONNECTION, email, username, userId) => {
        const QUERY = [
            `UPDATE ${TABLES.USER.TABLE} SET ${TABLES.USER.COLUMN.EMAIL} = ?, ${TABLES.USER.COLUMN.USERNAME} = ?
            WHERE ${TABLES.USER.COLUMN.ID} = ?`
        ]
        // const PASSWORD = await bcrypt.hash(password, 13)
        // const PARAMS = [[email, username, PASSWORD, level, userId]]
        const PARAMS = [[email, username, userId]]

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

    getByUserId = async (CONNECTION, userId) => {
        const QUERY_USER = `
        SELECT 
            U.*, 
            C.${TABLES.COMPANY.COLUMN.STATUS} AS STATUS,  
            C.${TABLES.COMPANY.COLUMN.NAME} AS companyName, 
            C.${TABLES.COMPANY.COLUMN.PASS_ID} AS passId
        FROM ${TABLES.USER.TABLE} AS U 
        JOIN ${TABLES.COMPANY.TABLE} AS C 
        ON U.${TABLES.USER.COLUMN.COMPANY_ID} = C.${TABLES.COMPANY.COLUMN.ID} 
        WHERE U.${TABLES.USER.COLUMN.ID} = ?;
    `;
        const QUERY_PRIVILEGES = `
        SELECT *
        FROM ${TABLES.LIST_PRIVILEGE.TABLE}
        WHERE ${TABLES.LIST_PRIVILEGE.COLUMN.USER_ID} = ?;
    `;
        const PARAMS = [[userId]];

        try {
            const [userResult] = await CONNECTION.query(QUERY_USER, PARAMS[0]);
            const user = userResult[0];
            const [privilegesResult] = await CONNECTION.query(QUERY_PRIVILEGES, [user[TABLES.USER.COLUMN.ID]]);
            // Mengumpulkan privileges ke dalam satu objek
            const privileges = privilegesResult.reduce((acc, privilege) => {
                acc[privilege.TABLE] = {
                    can_create: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE],
                    can_read: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_READ],
                    can_update: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE],
                    can_delete: privilege[TABLES.LIST_PRIVILEGE.COLUMN.CAN_DELETE],
                };
                return acc;
            }, {});

            return {
                cName: user.companyName, // Company Name
                uId: user[TABLES.USER.COLUMN.ID], // User Id
                uName: user[TABLES.USER.COLUMN.USERNAME], // Username
                eAddr: user[TABLES.USER.COLUMN.EMAIL], // Email
                privileges: privileges, // User Privileges
            };
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