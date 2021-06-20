
export const ApiConfig = {
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
  table: {
    create: "/table",
  },
  governersAddress: {
    save: "/governorsAddress/save ",
    submit: "/governorsAddress/submit",
    list: "/governorsAddress/getAll",
    getById: "/governorsAddress",
    m2mProcession: '/governorsAddress/getAllSubmittedList',
    miniutetominute: {
      save: "/governorsAddress/minuteToMinute/save",
      submit: "/governorsAddress/minuteToMinute/submit",
      list: "/governorsAddress/minuteToMinute/getAll",
      getById: "/governorsAddress/minuteToMinute",
    },
    procession: {
      save: "/governorsAddress/procession/create",
      list: "/governorsAddress/procession/getAll"
    },
    letter1: {
      create: "/governorsAddress/letter"
    },
    letter2: {
      create: "/governorsAddress/letterWithCoveringLetter"
    },
    letter3: {
      create: "/governorsAddress/correspondanceLawDept"
    },
    addSpeakerNote: "/governorsAddress/attachSpeakerNote",
    amendmentsforMOT: {
      approvedMOT: "/motionOfThanks/getAllApproved",
      create: "/mot/amendments/create"
    },
    setToLOB: "/governorsAddress/uploadGovernorsSpeechToLOB",
    timeAllocation: {
      save: "/governorsAddress/timeAllocation/save",
      submit: "/governorsAddress/timeAllocation/submit",
      generate: "/governorsAddress/timeAllocation/generateTimeAllocation",
      getDayAndDates: "/governorsAddress/timeAllocation/getDayAndDates",
      getByFileIdAndDay: "/governorsAddress/timeAllocation/getByFileIdAndDay",
      setToLOB: "/governorsAddress/timeAllocation/uploadToLOB",
      getTimeByFileIdAndDay: "/governorsAddress/timeAllocation/getMemberAllocation",
    },
    mot: {
      getById: "/mot/amendments/getAllForMot",
      createAmendment: "/mot/amendments/create",
      approvedList: "/motionOfThanks/getAllApproved",
      amendementByUser: "/mot/amendments/getAllForUserId",
      allMOT: "/motionOfThanks/getAllByStatus",
      resubmitFile: "/motionOfThanks/resubmit"
    }
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
  //old below - can be reused wherever required
  uploadFile: ":8088/file/uploadImage",
  portfolio: "mock/portfolio",
  department: "mock/subject",
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
  notification: {
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
  election: {
    getPendingDocuments: '/v1/election/os/document/getPendingDocuments',
    getDocById: '/v1/election/os/document',
    createProtemSpeaker: '/election/proTemSpeaker',
    getProtemList: '/election/proTemSpeaker/getByStatus',
    getElectionSpeakerList: '/election/speakerElection/list',
    createFile: '/v1/election/file/createFile',
    getProtemById: '/election/proTemSpeaker',
    resubmitFile: '/v1/election/file/resubmitFile',
    addSubtype: '/v1/election/file/addSubType',
    createProtemSpeakerAuth: '/election/proTemSpeakerAuth',
    getProtemSpeakerAuthList: '/election/proTemSpeakerAuth/getAll',
    protemBulletin: '/election/bulletin',
    protemBulletinPublish: '/publish',
    createSpeakerElection: '/election/speakerElection',
    createElectionNomination: '/election/nomination',
    getSpeakerElectionById: '/election/speakerElection',
    getCreatedNominations: '/election/nomination/get-created-by',
    getPendingForConsent: '/election/nomination/get-all-pending',
    updateNominationStatus: '/election/nomination/consent',
    updateNominationStatusAssistant: '/election/nomination/validate',
    generateVoteList: '/election/speakerElection/votelist/generate',
    getBulletinById: '/election/bulletin',
    getAllBulletin: '/election/bulletin/list',
    getPublishedBulletin: '/election/bulletin/list/published',
    createPanelOfChairman: '/election/panelOfChairman',
    panelOfChairman: '/election/panelOfChairman/panelList',
    generateReading: '/election/speakerElection/reading/generate',
    panelList: '/election/panelOfChairman',
    createFileAttachment: '/election/file-attachment',
    getUsersForNomination: '/election/speakerElection/getUserForNomination',
    requestConsent: '/election/nomination/request/consent',
    submitNomination: '/election/nomination/submit',
    getNominationForm: '/election/nomination/getForm',
    addToLOB: '/election/speakerElection/addToLob',
    getVoteListPreview: '/election/speakerElection/votelist/preview',
    getReading: '/election/speakerElection/report-data'
  },
  ReporterDiary: {
    create: '/save',
    list: '/list',
    saveReporterDiary: '/line/save',
    submitReorterDiary: '/submit',
    submittedReporterListByLobId: '/reporterline/submitted/bylob?lobLineId',
  },
  proccedingReporter: {
    create: '/save',
    list: '/list',
    forwardReporterDiary: '/forward',
    approveProceedingDiary: '/approve',
    getForActionReports: '/get/pending',
    getApprovedReports: '/list/approved',
    getMySubmissionReports: '/list/mysubmission',
    publish: '/publish',
    publishDiaryList: '/list/published'
  }
};