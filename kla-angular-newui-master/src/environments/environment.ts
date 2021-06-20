const HOST_SERVER = "http://45.249.111.246";
const FLIP_HOST_SERVER = "http://45.249.111.246";
const QUESTION_WRKFLW_HOST_SERVER = "http://45.249.111.153";
//  const QUESTION_HOST_SERVER = "http://172.16.0.54";
const QUESTION_HOST_SERVER = "http://45.249.111.153";
const DEV_SERVER = "http://45.249.111.153";

export const environment = {
  chat_api_url: HOST_SERVER + ":8083",
  auth_api_url: HOST_SERVER + ":8090/kla/service/identity",
  login_api_url: HOST_SERVER + ":8079/kla/service",
  user_mgmnt_api_url: HOST_SERVER + ":8082/kla/service",
  calendar_api_url: HOST_SERVER + ":8085/kla/service/v1/cos",
  aod_api_url: QUESTION_HOST_SERVER + ":7777/kla/service/v1/",
  document_api_url: FLIP_HOST_SERVER + ":8086/kla/service/v1/display",
  document_socket_api_url: FLIP_HOST_SERVER + ":8086",
  lob_api_url: DEV_SERVER + ":8084/kla/service/LobAgenda",
  rbs_api_url: HOST_SERVER + ":8082/kla/service/rbs/",
  business_controller_api_url: DEV_SERVER + ":8084/kla/service/runningNote",
  departmentmangement_api_url:
    HOST_SERVER + ":8089/kla/service/v1/departmentMangement",
  fileupload_url: FLIP_HOST_SERVER + ":8088/file",
  //user_menu_url: HOST_SERVER + ":8091/kla/service/menu",
  seat_management_url: HOST_SERVER + ":8080/kla/service/seatManagement",
  vote_url: HOST_SERVER + ":8092",
  lob_businesses_mock_url: HOST_SERVER + ":8084/kla/service/mock/business",
  running_note_api_url: DEV_SERVER + ":8084/kla/service/runningNote",
  flow_paper_api:
    FLIP_HOST_SERVER + ":85/flowpaper/simple_document.php?subfolder=&doc=",
  fingerprintauth: "http://localhost:8080/kla/service/v1/client-start-up/",
  get_system_ip: "http://localhost:8098/speakerIP/getIp",
  question_wrkflw_api_url:
    QUESTION_WRKFLW_HOST_SERVER + ":9000/kla/workflow/service/v1/",
  question_api_url: QUESTION_HOST_SERVER + ":7777/kla/service/v1/",
  rules_direction_api_url: QUESTION_HOST_SERVER + ":8089/kla/service/v1/",
  portfolio_mock_api_url: QUESTION_HOST_SERVER + ":7777/",
  cpl_api_url: DEV_SERVER,
  //fileflow_api_url: HOST_SERVER,
  workflow_api: HOST_SERVER + ":9000/kla/workflow/service/v1",
  cpl_section_id: 9,
  notice_processing_api: HOST_SERVER + ":8030/kla/service/notice/",
  file_flow_api: HOST_SERVER + ":8078/kla/service/v1/files/",
  file_api: DEV_SERVER,
  bullettin_list_api: HOST_SERVER + ":8078/kla/service/v1/bulletin/",
  correspondence_api: DEV_SERVER + ":8066/kla/service/v1/correspondence",
  production: true,
  bulletin_api: DEV_SERVER + ":8078/kla/service/v1/bulletin/",
  report_api_url: HOST_SERVER + ":8095",
  user_management_api: HOST_SERVER + ":8082/",
  billprocessing_api: HOST_SERVER + ":8044/kla/service/v1/bill", // to be removed, use bill_api_url
  bill_api_url: DEV_SERVER,
  committee_api_url: DEV_SERVER,
  pmbr_api_url: DEV_SERVER,
  table_api_url: DEV_SERVER,
  seat_plan_url: DEV_SERVER + ":8075/kla/service/seatManagement",
  office_api_url: DEV_SERVER,
  budget_api_url: DEV_SERVER,
  fileupload_url2: DEV_SERVER + ":8088/file/v2",
  generic_file_api_url: DEV_SERVER + ":8078/kla/service/v1",
  generic_file_api_urlx: HOST_SERVER + ":8082/kla/service/v1", //  FOR REMOVE
  generic_file_host: HOST_SERVER,
  lob_tablediary_api_uri: DEV_SERVER + ":8084/kla/service/v1/tableDiary",
  lob_ProceedingReporter_api_uri: DEV_SERVER + ":8084/kla/service/v1/proceeding",
  lob_service_api_uri: DEV_SERVER + ":8084/kla/service/v1",
  digitization_api_url: DEV_SERVER + ':8072/kla/service/v1'
};
