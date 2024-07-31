const SRT = require("../../.conf/.conf_database");
const TABLES = require("../../.conf/.conf_tables");

class Report {
    add = async () => {
        const CONNECTION = await SRT.getConnection();
        const QUERY =[`INSERT INTO ${TABLES.REPORT.TABLE} ()`]
    }

    get = async () => {

    }
}

const report = new Report()
module.exports = report