const ENDPOINTS = {
    GET: {
        COMPANY: {
            SEND_ACTIVATION: '/company/registration/activation/send',
            CONFIRMATION: '/company/registration/c/:passId',
        },
        REPORT: {
            BY_COMPANY_ID: '/report/:companyId'
        }
    },
    POST: {
        LOGIN: '/login',
        COMPANY: {
            REGISTRATION: '/company/registration',
        },
        REPORT: {
            ADD: '/report/add',
            ASSIGN: '/report/assign',
            EDIT: '/report/edit',
        }
    }
}

module.exports = ENDPOINTS