const HOST_SERVER = "http://45.249.111.246";
const QUSETION_HOST_SERVER = "http://45.249.111.153";
const QUSETION_WRKFLW_HOST_SERVER = "http://45.249.111.153";
const DEV_SERVER = "http://45.249.111.153";

export const environment = {
  chat_api_url: HOST_SERVER + ":8083",
  auth_api_url: HOST_SERVER + ":8090/kla/service/identity",
  login_api_url: HOST_SERVER + ":8079/kla/service",
  user_mgmnt_api_url: HOST_SERVER + ":8082/kla/service",
  calendar_api_url: HOST_SERVER + ":8085/kla/service/v1/cos",
  document_api_url: HOST_SERVER + ":8086/kla/service/v1/display",
  document_socket_api_url: HOST_SERVER + ":8086",
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
    HOST_SERVER + "/kla-app/flowpaper-comm/simple_document.php?subfolder=&doc=",
  fingerprintauth: 'http://localhost:8080/kla/service/v1/client-start-up/',
  production: true,
  question_api_url: QUSETION_HOST_SERVER + ":7777/kla/service/v1/",
  question_wrkflw_api_url: QUSETION_WRKFLW_HOST_SERVER + ":9000/kla/workflow/service/v1/",
  rules_direction_api_url: QUSETION_HOST_SERVER + ":8089/kla/service/v1/",
  portfolio_mock_api_url: QUSETION_HOST_SERVER + ":7777/",
  notice_processing_api: 'http://45.249.111.150:8030/kla/service/notice/',
  workflow_api: 'http://45.249.111.150:9000/kla/workflow/service/v1',
  cpl_api_url: DEV_SERVER,
  //fileflow_api_url: DEV_SERVER,
  fileflow_api_url: DEV_SERVER,
  file_api: DEV_SERVER,
  cpl_section_id: 9,
  file_flow_api: HOST_SERVER + ':8078/kla/service/v1/files/',
  bullettin_list_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  correspondence_api: DEV_SERVER + ':8066/kla/service/v1/correspondence',
  user_management_api: HOST_SERVER + ':8082/',
  fileupload_url2: DEV_SERVER + ":8088/file/v2",
  generic_file_api_url: DEV_SERVER + ":8078/kla/service/v1",
  generic_file_api_urlx: HOST_SERVER + ":8082/kla/service/v1", //  FOR REMOVE
  generic_file_host: HOST_SERVER,
  lob_ProceedingReporter_api_uri: DEV_SERVER + ":8084/kla/service/v1/proceeding",
};
