
const PATH = {
    GET: {
        COMPANY: {
            CONFIRMATION: require('../APIS/POST/company/emailActivation'),
        },
        REPORT: {
            BY_COMPANY_ID: require('../APIS/GET/report/byCompanyId'),
        }
    },
    POST: {
        LOGIN: require('../APIS/POST/login'),
        COMPANY: {
            SEND_ACTIVATION: require('../APIS/POST/company/sendActivation'),
            REGISTRATION: require('../APIS/POST/company/resgistration'),
        },
        REPORT: {
            ADD: require('../APIS/POST/report/add'),
            ADD_DETAIL: require('../APIS/POST/report/detail/addDetail'),
            ASSIGN: require('../APIS/POST/report/detail/assignedTo'),
            EDIT: require('../APIS/POST/report/edit'),
        }
    }
}

const ARRAY_OF_PATHS = {
    GET: [        
        PATH.GET.COMPANY.CONFIRMATION,

        PATH.GET.REPORT.BY_COMPANY_ID,
    ],
    POST: [
        PATH.POST.LOGIN,
        
        PATH.POST.COMPANY.SEND_ACTIVATION,
        PATH.POST.COMPANY.REGISTRATION,

        PATH.POST.REPORT.ADD,
        PATH.POST.REPORT.ADD_DETAIL,
        PATH.POST.REPORT.ASSIGN,
        PATH.POST.REPORT.EDIT,
    ],
}

module.exports = ARRAY_OF_PATHS