
export const ApiConfig = {
  basePathDocuments: ':8066/kla/service/v1/documents/template',
  basePathExt: ":8075/kla/service/v1/table",
  basePathFile: ":8078/kla/service/v1/files",
  basePathBulletinFile: ":8078/kla/service/v1/bulletin",
  basePathReg: ":8089/kla/service/v1/departmentMangement",
  basePathNotification: ":8066/kla/service/v1/notification",
  basePathCorrespondence: ":8066/kla/service/v1/correspondence",
  basePathElection: ':8074/kla/service',
  basePathOfficeSection: ":8076/kla/service/officesection",
  basePathTableDiary: "/tableDiary",
  basePathResume: "/resume",
  basePathFileTableDiary: ":8084/kla/service/v1/table",
  basePathReporter: '/reporter',
  documents: {
    getAllTemplate: '/getAllTemplates',
    deleteTemplate: '/deleteTemplate',
    saveTemplateWithInputs: '/createTemplateWithInput',
    getAllBusinessByType: '/business/getAll/type',
    getAllInputType: '/inputType/getAll',
    getDocumentList:'',
    getTemplateById:''
  }
};
