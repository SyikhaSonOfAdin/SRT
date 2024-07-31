const ENDPOINTS = {
    GET: {
        COMPANY: {
            SEND_ACTIVATION: '/company/registration/activation/send',
            CONFIRMATION: '/company/registration/c/:passId',
        }
    },
    POST: {
        LOGIN: '/login',
        COMPANY: {
            REGISTRATION: '/company/registration',
        }
    }
}

module.exports = ENDPOINTS