
export const ApiConfig = {
  basePathExt: ":8055/kla/service/v1/committee",
  basePathFile: ":8078/kla/service/v1/files",
  basePathWorkflow: ":9000/kla/workflow/service/v1/task",
  basePathBulletinFile: ":8078/kla/service/v1/bulletin",
  basePathReg: ":8089/kla/service/v1/departmentMangement",
  basePathNotification: ":8066/kla/service/v1/notification",
  basePathCorrespondence: ":8066/kla/service/v1/correspondence",
  billApiUrl: ':8044/kla/service/v1/bill',
  agendaPath: ":8055/kla/service/v1/cos",
  basePathBill: ":8044/kla/service/v1/pmbr",
  committe: {
    create: "",
    viewById: "",
    list: "",
    createFile: "/committee"
  },
  bulletin: {
    create: "/bulletin",
    publish: "/publish",
    list: "/bulletin/list",
    approvedList: "/bulletin/list/approved",
    publishedList: "/bulletin/list/published",
    view: "/bulletin",
  },
  //old below - can be reused wherever required
  uploadFile: ":8088/file/uploadImage",
  portfolio: "mock/portfolio",
  files: {
    create: "/file/createRegistrationList",
    list: "/all",
    approved: "/getAll",
    workFlowUsers: "/getWorkflowActionUsers",
    pendingFilesForUser: "/dashBoard/user",
    pendingFilesForSection: "/dashBoard/section",
    aaprovedByHigherOfficial: "/all/ownerId",
    changeSubmitStatus: "/document/submitDocument",
    addAttachment: "/addAttachment",
    statusUpdate: "/update/status",
    ratification: "/file/ratification/pending",
    getAll: "/file/getAll",
    getPending: "/file/getAllPending",
    speakerNote: '/file/getSpeakerNote',
    getFilebyId: "/file/getByFileId"
  },
  correspondenceTemplate: {
    getAllWorkFlow: "/template/workflow/type",
    getTypeBySection: "/getAll",
    getAllInputType: "/template/inputType/getAll",
    saveTemplateWithInputs: "/template/createTemplateWithInput",
    getAllBusiness: "/template/business/getAll",
    getTemplateById: "/template/getById",
    deleteTemplateInput: "/template/deleteTemplateInput",
    getAllTemplate: "/template/getAllTemplates",
    getPending: "/pending",
    sent: "/sent",
    inbox: "/inbox",
    outbox: "/outbox",
    addNote: "/notes",
    deleteNote: "/notes/byId",
    getAllCode: "/getAllCode",
    deleteTemplate: "/template/deleteTemplate",
  },
  meeting: {
    createMeeting: '/meeting',
    createMinutes: '/meeting/minutes',
    getMinutesByMeetId: '/meeting/minutes/getByMeetingId',
    getAttendees: '/meeting/minutes/populate',
    getAllBusiness: '/meeting/getBusiness',
    populateMembers: '/attendence/populate',
    list: '/meeting/list'
  },
  file: {
   
  }
};
