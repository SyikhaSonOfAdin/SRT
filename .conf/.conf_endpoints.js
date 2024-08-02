const ENDPOINTS = {
    GET: {
        COMPANY: {            
            CONFIRMATION: '/company/registration/c/:passId',
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
        REPORT: {
            ADD: '/report/add',
            ADD_DETAIL: '/report/add_detail',
            ASSIGN: '/report/assign',
            EDIT: '/report/edit',
        }
    }
}

module.exports = ENDPOINTS