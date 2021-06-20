const HOST_SERVER = "http://202.88.234.49";
const QUSETION_HOST_SERVER = "http://202.88.234.49";
const QUSETION_WRKFLW_HOST_SERVER = "http://202.88.234.49";
const QUESTION_HOST_SERVER = "http://202.88.234.49";

export const environment = {
  chat_api_url: HOST_SERVER + ":8083",
  auth_api_url: HOST_SERVER + ":8090/kla/service/identity",
  login_api_url: HOST_SERVER + ":8079/kla/service",
  user_mgmnt_api_url: HOST_SERVER + ":8082/kla/service",
  calendar_api_url: HOST_SERVER + ":8085/kla/service/v1/cos",
  document_api_url: HOST_SERVER + ":8086/kla/service/v1/display",
  document_socket_api_url: HOST_SERVER + ":8086",
  aod_api_url: QUESTION_HOST_SERVER + ":7777/kla/service/v1/",
  lob_api_url: HOST_SERVER + ":8084/kla/service/LobAgenda",
  business_controller_api_url: HOST_SERVER + ":8084/kla/service/runningNote",
  departmentmangement_api_url:
    HOST_SERVER + ":8089/kla/service/v1/departmentMangement",
  fileupload_url: HOST_SERVER + ":8088/file",
  //user_menu_url: HOST_SERVER + ":8091/kla/service/menu",
  seat_management_url: HOST_SERVER + ":8080/kla/service/seatManagement",
  vote_url: HOST_SERVER + ":8092",
  lob_businesses_mock_url: HOST_SERVER + ":8084/kla/service/mock/business",
  running_note_api_url: HOST_SERVER + ":8084/kla/service/runningNote",
  flow_paper_api:
    HOST_SERVER + "/flowpaper/simple_document.php?subfolder=&doc=",
  question_api_url: QUSETION_HOST_SERVER + ":7777/kla/service/v1/",
  question_wrkflw_api_url: QUSETION_WRKFLW_HOST_SERVER + ":9000/kla/workflow/service/v1/",
  rules_direction_api_url: QUSETION_HOST_SERVER + ":8089/kla/service/v1/",
  portfolio_mock_api_url: QUSETION_HOST_SERVER + ":7777/",
  notice_processing_api: HOST_SERVER + ':8030/kla/service/notice/',
  cpl_api_url: HOST_SERVER,
  //fileflow_api_url: HOST_SERVER,
  cpl_section_id: 8,
  fingerprintauth: "http://localhost:8080/kla/service/v1/client-start-up/",
  get_system_ip: "http://localhost:8080/kla/service/v1/client-start-up/getSpeakerIp",
  workflow_api: HOST_SERVER + ':9000/kla/workflow/service/v1',
  file_flow_api: HOST_SERVER + ':8078/kla/service/v1/files/',
  bullettin_list_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  correspondence_api: HOST_SERVER + ':8066/kla/service/v1/correspondence',
  production: true,
  rbs_api_url: HOST_SERVER + ":8082/kla/service/rbs/",
  report_api_url: HOST_SERVER + ':8095',
  bulletin_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  user_management_api: HOST_SERVER + ':8082/',
  fileupload_url2: HOST_SERVER + ":8088/file/v2",
  generic_file_api_url: HOST_SERVER + ":8078/kla/service/v1",
  generic_file_api_urlx: HOST_SERVER + ":8082/kla/service/v1", //  FOR REMOVE
  generic_file_host: HOST_SERVER,
  lob_ProceedingReporter_api_uri: HOST_SERVER + ":8084/kla/service/v1/proceeding",
};
