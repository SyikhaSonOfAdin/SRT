
const PATH = {
    GET: {
        COMPANY: {
            SEND_ACTIVATION: require('../APIS/POST/company/sendActivation'),
            CONFIRMATION: require('../APIS/POST/company/emailActivation'),
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
    ],
    POST: [
        PATH.POST.LOGIN,
        PATH.POST.COMPANY.REGISTRATION,
    ],
}

module.exports = ARRAY_OF_PATHS