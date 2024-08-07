const PATH = {
    GET: {
        COMPANY: {
            CONFIRMATION: require('../APIS/POST/company/emailActivation'),
        },
        CATEGORY: {
            BY_COMPANY_ID: '/category/add',
        },
        DEPARTMENTS: {
            BY_COMPANY_ID: require('../APIS/GET/departments/byCompanyId'),
        },
        LOCATIONS: {
            BY_COMPANY_ID: require('../APIS/GET/locations/byCompanyId'),
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
        CATEGORY: {
            ADD: require('../APIS/POST/category/add'),
            DELETE: require('../APIS/POST/category/delete'),
            EDIT: require('../APIS/POST/category/edit'),
        },
        DEPARTMENT: {
            ADD: require('../APIS/POST/department/add'),
            DELETE: require('../APIS/POST/department/delete'),
            EDIT: require('../APIS/POST/department/edit'),
        },
        LOCATIONS: {
            ADD: require('../APIS/POST/location/add'),
            EDIT: require('../APIS/POST/location/edit'),
            DELETE: require('../APIS/POST/location/delete'),
        },
        REPORT: {
            ADD: require('../APIS/POST/report/add'),
            ADD_DETAIL: require('../APIS/POST/report/detail/addDetail'),
            ASSIGN: require('../APIS/POST/report/detail/assignedTo'),
            EDIT: require('../APIS/POST/report/edit'),
        },
        USER: {
            ADD: require('../APIS/POST/user/add'),
            EDIT: require('../APIS/POST/user/edit'),
        },
        LIST_EMAIL: {
            ADD: require('../APIS/POST/listEmail/add'),
            EDIT: require('../APIS/POST/listEmail/edit'),
            DELETE: require('../APIS/POST/listEmail/delete'),
        }
    }
}

const ARRAY_OF_PATHS = {
    GET: [
        PATH.GET.COMPANY.CONFIRMATION,

        PATH.GET.DEPARTMENTS.BY_COMPANY_ID,

        PATH.GET.LOCATIONS.BY_COMPANY_ID,

        PATH.GET.REPORT.BY_COMPANY_ID,
    ],
    POST: [
        PATH.POST.LOGIN,

        PATH.POST.COMPANY.SEND_ACTIVATION,
        PATH.POST.COMPANY.REGISTRATION,

        PATH.POST.CATEGORY.ADD,
        PATH.POST.CATEGORY.DELETE,
        PATH.POST.CATEGORY.EDIT,

        PATH.POST.DEPARTMENT.ADD,
        PATH.POST.DEPARTMENT.DELETE,
        PATH.POST.DEPARTMENT.EDIT,

        PATH.POST.LOCATIONS.ADD,
        PATH.POST.LOCATIONS.DELETE,
        PATH.POST.LOCATIONS.EDIT,

        PATH.POST.REPORT.ADD,
        PATH.POST.REPORT.ADD_DETAIL,
        PATH.POST.REPORT.ASSIGN,
        PATH.POST.REPORT.EDIT,

        PATH.POST.USER.ADD,
        PATH.POST.USER.EDIT,

        PATH.POST.LIST_EMAIL.ADD,
        PATH.POST.LIST_EMAIL.DELETE,
        PATH.POST.LIST_EMAIL.EDIT,
    ],
}

module.exports = ARRAY_OF_PATHS