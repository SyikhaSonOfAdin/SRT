const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");

class Privileges {
    #tables = [
        TABLES.COMPANY_DEPARTMENTS.TABLE,
        TABLES.COMPANY_LOCATIONS.TABLE,
        TABLES.COMPANY_SETTINGS.TABLE,
        TABLES.LIST_CATEGORY.TABLE,
        TABLES.LIST_EMAIL.TABLE,
        TABLES.REPORT.TABLE,
        TABLES.USER.TABLE,
    ];

    add = async (CONNECTION, userId, privileges) => {

        try {
            const QUERY = `
                INSERT INTO ${TABLES.LIST_PRIVILEGE.TABLE} (
                    ${TABLES.LIST_PRIVILEGE.COLUMN.USER_ID}, 
                    \`${TABLES.LIST_PRIVILEGE.COLUMN.TABLE}\`,
                    ${TABLES.LIST_PRIVILEGE.COLUMN.CAN_CREATE}, 
                    ${TABLES.LIST_PRIVILEGE.COLUMN.CAN_READ}, 
                    ${TABLES.LIST_PRIVILEGE.COLUMN.CAN_UPDATE},
                    ${TABLES.LIST_PRIVILEGE.COLUMN.CAN_DELETE}
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            const promises = this.#tables.map(async (tableName) => {
                const privilege = privileges[tableName] || {};
                const { create, read, update, del } = privilege;

                await CONNECTION.query(QUERY, [
                    userId,
                    tableName,
                    create,
                    read,
                    update,
                    del,
                ]);
            });

            await Promise.all(promises);
        } catch (error) {
            throw error
        }
    };
}

const privilegesInstance = new Privileges();

module.exports = {
    privilegesInstance,
    Privileges
};
