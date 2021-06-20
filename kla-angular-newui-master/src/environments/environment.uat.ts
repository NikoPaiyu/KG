const HOST_SERVER = "http://45.249.111.251";
const FLIP_HOST_SERVER = "http://45.249.111.251:85";
const HOST_SERVER_QA = "http://45.249.111.246";

const QUESTION_HOST_SERVER = "http://45.249.111.153";

export const environment = {
  chat_api_url: HOST_SERVER + ":8083",
  auth_api_url: HOST_SERVER + ":8090/kla/service/identity",
  login_api_url: HOST_SERVER + ":8079/kla/service",
  //user_mgmnt_api_url: HOST_SERVER + ":8082",
  user_mgmnt_api_url: HOST_SERVER + ":8082/kla/service",
  calendar_api_url: HOST_SERVER + ":8085/kla/service/v1/cos",
  document_api_url: HOST_SERVER + ":8086/kla/service/v1/display",
  document_socket_api_url: HOST_SERVER + ":8086",
  lob_api_url: HOST_SERVER + ":8084/kla/service/LobAgenda",
  rbs_api_url: HOST_SERVER + ":8082/kla/service/rbs/",
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
    FLIP_HOST_SERVER + "/kla-app/flowpaper-comm/simple_document.php?subfolder=&doc=",
  fingerprintauth: 'http://localhost:8080/kla/service/v1/client-start-up/',
  get_system_ip: "http://localhost:8098/speakerIP/getIp",
  production: true,
  question_api_url: HOST_SERVER + ":7777/kla/service/v1/",
  question_wrkflw_api_url: HOST_SERVER + ":9000/kla/workflow/service/v1/",
  rules_direction_api_url: HOST_SERVER + ":8089/kla/service/v1/",
  portfolio_mock_api_url: HOST_SERVER + ":7777/",
  notice_processing_api: HOST_SERVER + ':8030/kla/service/notice/',
  workflow_api: HOST_SERVER + ':9000/kla/workflow/service/v1',
  //fileflow_api_url: HOST_SERVER,
  cpl_api_url: HOST_SERVER,
  cpl_section_id: 8,
  file_flow_api: HOST_SERVER + ':8078/kla/service/v1/files/',
  bullettin_list_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  correspondence_api: HOST_SERVER + ':8066/kla/service/v1/correspondence',
  aod_api_url: HOST_SERVER + ":7777/kla/service/v1/",
  report_api_url: HOST_SERVER + ":8095",
  bulletin_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  user_management_api: HOST_SERVER + ':8082/',
  bill_api_url: HOST_SERVER,
  committee_api_url: HOST_SERVER,
  file_api: HOST_SERVER,
  table_api_url: HOST_SERVER,
  office_api_url: HOST_SERVER,
  billprocessing_api: HOST_SERVER + ":8044/kla/service/v1/bill", // to be removed, use bill_api_url
  pmbr_api_url: HOST_SERVER,
  seat_plan_url: HOST_SERVER + ":8075/kla/service/seatManagement",
  budget_api_url: HOST_SERVER,
  fileupload_url2: HOST_SERVER + ":8088/file/v2",
  generic_file_api_url: HOST_SERVER + ":8078/kla/service/v1",
  generic_file_api_urlx: HOST_SERVER + ":8082/kla/service/v1", //  FOR REMOVE
  generic_file_host: HOST_SERVER,
  lob_tablediary_api_uri: HOST_SERVER + ":8084/kla/service/v1/tableDiary",
  lob_ProceedingReporter_api_uri: HOST_SERVER + ":8084/kla/service/v1/proceeding",
  lob_service_api_uri: HOST_SERVER + ":8084/kla/service/v1",
};
