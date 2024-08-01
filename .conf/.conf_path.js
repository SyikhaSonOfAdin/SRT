
const PATH = {
    GET: {
        COMPANY: {
            SEND_ACTIVATION: require('../APIS/POST/company/sendActivation'),
            CONFIRMATION: require('../APIS/POST/company/emailActivation'),
        },
        REPORT: {
            BY_COMPANY_ID: require('../APIS/GET/report/byCompanyId'),
        }
    },
    POST: {
        LOGIN: require('../APIS/POST/login'),
        COMPANY: {
            REGISTRATION: require('../APIS/POST/company/resgistration'),
        }
    }
}

const ARRAY_OF_PATHS = {
    GET: [
        PATH.GET.COMPANY.SEND_ACTIVATION,
        PATH.GET.COMPANY.CONFIRMATION,

        PATH.GET.REPORT.BY_COMPANY_ID,
    ],
    POST: [
        PATH.POST.LOGIN,
        PATH.POST.COMPANY.REGISTRATION,
    ],
}

module.exports = ARRAY_OF_PATHS