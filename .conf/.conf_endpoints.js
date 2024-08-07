const ENDPOINTS = {
    GET: {
        COMPANY: {            
            CONFIRMATION: '/company/registration/c/:passId',
        },
        CATEGORY: {            
            BY_COMPANY_ID: '/category/:companyId',
        },
        DEPARTMENTS: {
            BY_COMPANY_ID: '/departments/:companyId'
        },
        LOCATIONS: {
            BY_COMPANY_ID: '/locations/:companyId'
        },
        REPORT: {
            BY_COMPANY_ID: '/report/:companyId'
        }
    },
    POST: {
        LOGIN: '/login',
        COMPANY: {
            SEND_ACTIVATION: '/company/registration/activation/send',
            REGISTRATION: '/company/registration',
        },
        CATEGORY: {
            ADD: '/category/add',
            DELETE: '/category/delete',
            EDIT: '/category/edit',
        },
        DEPARTMENT: {
            ADD: '/departments/add',
            DELETE: '/departments/delete',
            EDIT: '/departments/edit',
        },        
        USER: {
            ADD: '/user/add',
            ADD_BY_COMPANY: '/user/bc/add',
            EDIT: '/user/edit',
            EDIT_BY_COMPANY: '/user/bc/edit',
        },
        LIST_EMAIL: {
            ADD: '/list_email/add',
            EDIT: '/list_email/edit',
            DELETE: '/list_email/delete',
        },
        LOCATIONS: {
            ADD: '/locations/add',
            DELETE: '/locations/delete',
            EDIT: '/locations/edit',
        },
        REPORT: {
            ADD: '/report/add',
            ADD_DETAIL: '/report/add_detail',
            ASSIGN: '/report/assign',
            EDIT: '/report/edit',
        },
    }
}

module.exports = ENDPOINTS