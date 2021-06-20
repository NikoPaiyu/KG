export const ApiConfig = {
    basePathExt: ":8077/kla/service/v1/cpl",
    basePathFile: ":8078/kla/service/v1/files",
    basePathReg: ":8089/kla/service/v1/departmentMangement",
    basePathNotification: ":8066/kla/service/v1/notification",
    basePathCurrespondence: ":8066/kla/service/v1/correspondence",
    basePathOfficeSection: ":8076/kla/service/officesection",
    basePathElection: ":8074/kla/service",
    documents: {
      create: "/register",
      list: "/list",
      view: "/getById",
      registerAttach: "/registerAndAttach",
      dashboard: "/dashboard",
      documentList: "/list/preparation",
      refreshList: "/list/refreshDocuments",
      saveDocumentList: "/list/saveDocumentList",
      layingList: "/list/byLayingDate",
      removeFromList: "/list/remove",
      update: "/update",
      getByListId: "/list/getListById",
      deleteAttachment: "/deleteAttachment",
      deptDocSave: "/departmentRegister",
      deptSubmit: "/departmentSubmit",
      deptDocs: "/get",
      assign: "/assignToAssistant",
      getAllAmentments: "/amendment/getAllAmendments",
      updateAmentmentStatus: "/list/updateStatus",
      officeSection: "/officeSection/documents/save",
      deleteAllAttachmentById: "/officeSection/documents/deleteAllAttachment",
      officeSectionList: "/officeSection/documents/getDocuments",
      officeSectionAssign: "/officeSection/documents/assignToAssitant",
      officeSectionSubmit: "/officeSection/documents/submit",
      officeSectionReturn: "/officeSection/documents/return",
      updateLaidDocument: "/updateLaidDocument",
      officeSectionPending: "/officeSection/documents/getPendingDocuments",
      pendingForAction: "/getPending",
      deleteOSDoc: "/officeSection/documents/deleteById",
      editOSDoc: "/officeSection/documents/update",
      createAmendementList: "/file/createAmendmentList",
      institution: "/institution",
      actName: "/act",
      pendingAmendments: "/amendment/getPending",
      getAmendById: "/amendment",
      getAmendmentListById: '/amendment/getAmendmentList',
      // workflowUser: "/amendment/getWorkflowActionUsers",
      // forwardAmendment: "/amendment/forward",
      // amendNote: "/amendment/note",
      approvedAmendments: "/amendment/getApprovedDocumnets",
      departmentWithdraw: "/department/withdrawal",
      withdrawList: "/getPending/withdrawal",
      officeSectionGetDocumentById: "/officeSection/documents/getById",
      deptDashboard: "/dashboard/department",
      correctionStatement: "/getPending/correction",
      requestcorrectionStatement: "/department/correction",
    },
    uploadFile: ":8088/file/uploadImage",
    portfolio: "mock/portfolio",
    files: {
      create: "/file/createRegistrationList",
      list: "/all",
      approved: "/getAll",
      createDocumentList: "/file/createDocumentList",
      workFlowUsers: "/getWorkflowActionUsers",
      pendingFilesForUser: "/dashBoard/user",
      pendingFilesForSection: "/dashBoard/section",
      aaprovedByHigherOfficial: "/all/ownerId",
      getAllTemplateList: "/document/template/getAllTemplates",
      getTemplateFormByTemplateId: "/document/template/getTemplateForm",
      changeSubmitStatus: "/document/submitDocument",
      addAttachment: "/addAttachment",
      statusUpdate: "/update/status",
      ratification: "/file/ratification/pending",
      getAll: "/file/getAll",
      getPending: "/file/getAllPending",
      supervisor: "/dashBoard/supervisor",
      speakerNote: '/file/getSpeakerNote',
      fileClosure: '/file/fileClosure'
    },
    notification: {
      getCurrespondenceDepartmentRecieved:
        "/letter/getCorresponseDepartmentRecived?departmentId",
      chnageUploadStatus: "/letter/markSent?correspondenceId",
      uploadDelayStatement: "/letter/sendDelayStatement",
    },
    notes: {
      create: "",
      list: "",
    },
    currespondenceTemplate: {
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
    tables: {
      createDocument: '/v1/election/os/document'
    }
  };
  