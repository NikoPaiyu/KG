const HOST_SERVER = 'http://192.168.204.243';
const FLIP_HOST_SERVER = "http://192.168.204.246";
const QUESTION_HOST_SERVER = "http://45.249.111.153";
export const environment = {
  chat_api_url: HOST_SERVER + ":8083",
  auth_api_url: HOST_SERVER + ":8090/kla/service/identity",
  login_api_url: HOST_SERVER + ":8079/kla/service",
  user_mgmnt_api_url: HOST_SERVER + ":8082/kla/service",
  calendar_api_url: HOST_SERVER + ":8085/kla/service/v1/cos",
  document_api_url: FLIP_HOST_SERVER + ":8086/kla/service/v1/display",
  document_socket_api_url: FLIP_HOST_SERVER + ":8086",
  lob_api_url: HOST_SERVER + ":8084/kla/service/LobAgenda",
  rbs_api_url: HOST_SERVER + ":8082/kla/service/rbs/",
  business_controller_api_url: HOST_SERVER + ":8084/kla/service/runningNote",
  departmentmangement_api_url:
    HOST_SERVER + ":8089/kla/service/v1/departmentMangement",
  fileupload_url: FLIP_HOST_SERVER + ":8088/file",
  //user_menu_url: HOST_SERVER + ":8091/kla/service/menu",
  seat_management_url: HOST_SERVER + ":8080/kla/service/seatManagement",
  vote_url: HOST_SERVER + ":8092",
  lob_businesses_mock_url: HOST_SERVER + ":8084/kla/service/mock/business",
  running_note_api_url: HOST_SERVER + ":8084/kla/service/runningNote",
  question_api_url: QUESTION_HOST_SERVER + ":7777/kla/service/v1/",
  flow_paper_api:
    FLIP_HOST_SERVER + "/kla-app/simple_document.php?subfolder=&doc=",
  fingerprintauth: "http://localhost:8080/kla/service/v1/client-start-up/",
  get_system_ip: "http://localhost:8098/speakerIP/",
  bulletin_api: HOST_SERVER + ':8078/kla/service/v1/bulletin/',
  production: true,
  user_management_api: HOST_SERVER + ':8082/',
  lob_ProceedingReporter_api_uri: HOST_SERVER + ":8084/kla/service/v1/proceeding",
};
