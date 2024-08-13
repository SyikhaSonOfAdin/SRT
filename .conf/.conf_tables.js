const TABLES = {
    USER: {
        TABLE: "users",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            USERNAME: "USERNAME",
            EMAIL: "EMAIL",
            PASSWORD: "PASSWORD",
            LEVEL: "LEVEL",
            SINCE: "SINCE",
        }
    },
    COMPANY: {
        TABLE: "company",
        COLUMN: {
            ID: "ID",
            EMAIL: "EMAIL",
            PASSWORD: "PASSWORD",
            NAME: "NAME",
            SINCE: "SINCE",
            PASS_ID: "PASS_ID",
            STATUS: "STATUS",
        }
    },
    COMPANY_LOCATIONS: {
        TABLE: "company_locations",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            INPUT_BY: "INPUT_BY",
            INPUT_DATE: "INPUT_DATE",
            NAME: "NAME",
        }
    },
    COMPANY_DEPARTMENTS: {
        TABLE: "company_departments",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            INPUT_BY: "INPUT_BY",
            INPUT_DATE: "INPUT_DATE",
            NAME: "NAME",
        }
    },
    LIST_CATEGORY: {
        TABLE: "list_category",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            INPUT_BY: "INPUT_BY",
            INPUT_DATE: "INPUT_DATE",
            NAME: "NAME",
        }
    },
    LIST_EMAIL: {
        TABLE: "list_email",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            INPUT_BY: "INPUT_BY",
            INPUT_DATE: "INPUT_DATE",
            EMAIL: "EMAIL",
        }
    },
    REPORT: {
        TABLE: "report",
        COLUMN: {
            ID: "ID",
            LOCATION_ID: "LOCATION_ID",
            DEPARTMENT_ID: "DEPARTMENT_ID",
            CATEGORY_ID: "CATEGORY_ID",
            TICKET: "TICKET",
            INPUT_DATE: "INPUT_DATE",
            INPUT_BY: "INPUT_BY",
            REPORT_ISSUE: "REPORT_ISSUE",
            STATUS: "STATUS",
        }
    },
    REPORT_DETAIL: {
        TABLE: "report_detail",
        COLUMN: {
            ID: "ID",
            REPORT_ID: "REPORT_ID",
            ASSIGNED_USER: "ASSIGNED_USER",
            INPUT_DATE: "INPUT_DATE",
            FINISH_DATE: "FINISH_DATE",
            RESULT: "RESULT",
            PROBLEMS: "PROBLEMS",
            SOLUTIONS: "SOLUTIONS",
        }
    },
    COMPANY_SETTINGS: {
        TABLE: "company_settings",
        COLUMN: {
            ID: "ID",
            COMPANY_ID: "COMPANY_ID",
            COMPANY_CODE: "COMPANY_CODE",
            URL: "URL",
        }
    },
    LIST_PRIVILEGE: {
        TABLE: "list_privilege",
        COLUMN: {
            ID: "ID",
            USER_ID: "USER_ID",
            TABLE: "TABLE",
            CAN_CREATE: "CAN_CREATE",
            CAN_READ: "CAN_READ",
            CAN_UPDATE: "CAN_UPDATE",
            CAN_DELETE: "CAN_DELETE",
        }
    }
};

module.exports = TABLES;
