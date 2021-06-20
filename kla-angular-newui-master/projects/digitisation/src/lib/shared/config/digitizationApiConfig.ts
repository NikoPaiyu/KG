const digitizationMasterUrl = 'master/digitisation';
const digitizationUrl = 'digitisation'
export const apiConfi = {
    master: {
        getAssemblySessionList: '/getAllAssemblyAndSession',
        getKlaSection: '/getsection',
        getDepartment: 'mock/subject/getAllDepartments',
        getDocumentType: `/${digitizationMasterUrl}/documentType/list`,
        getDocumentSubType: `/${digitizationMasterUrl}/documentSubType/list`,
        getAccesLevelList: `/${digitizationMasterUrl}/accessLevel/list`
    },

    digitization: {

    }
}