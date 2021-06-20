export const ApiConfig = {
  // genericfileBasePathExt: ":8044/kla/service/v1/files",
  basePathFile: ":8078/kla/service/v1/files",
  basePathWrkflow: ":9000/kla/workflow/service/v1/task",
  basedocUpload: ":8088/file",
  baseTemplate: "/files/document/template",
  file: {
    create: "/",
    view: "/list",
    viewById: "/generic/",
    update: "",
    getAll: "/getAll",
    createFile: "/generic",
    updateFile: "/generic",
    forwardFile: "/forward",
    approveFile: {
      type: "/generic",
      action: "/approve",
      partialApprove: "/partialApprove",
    },
    block: {
      create: "/generic/business/block",
      update: "/generic/business/block/",
      delete: "/generic/business/",
      list: "/generic/business/block/",
      document: {
        create: "/generic/attachment",
        share: "/generic/document/share",
        sharedWithMe: "/generic/document/share/user",
        subType: "/generic/document/subtype/getByTypeCode?code=",
      },
    },
    upload: "/uploadImage",
    myFiles: "/generic/myFiles",
    allFiles: "/generic/getAll",
    pendingFiles: "/pending/type"
  },
  UserNonMember: "/users/member/getNonMembers",
  note: {
    create: "/notes",
    update: "/notes",
    delete: "/notes/byId",
  },
  klaInfo: {
    assembly: "/mock/getAllAssembly",
    session: "/mock/getAllSession",
    departments: "/getdepartment",
    sections: "/getsection",
    designations: "/getdesignation",
    nonmembers: "/users/member/getNonMembers",
  },
  template: {
    templateList: "/files/document/template/getAllTemplates",
    createTemplate: "/files/document/template/createTemplateWithInput",
    list: "/getAllTemplates",
  },
  workFlow: {
    workFlowById: "/tracking?processInstanceId=",
  },
  stringToPDF: ":8095/string-to-pdf",
};
