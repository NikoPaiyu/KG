"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.FileServiceService = void 0;
var core_1 = require("@angular/core");
var api_config_1 = require("../config/api.config");
var operators_1 = require("rxjs/operators");
var FileServiceService = /** @class */ (function () {
    function FileServiceService(environment, http) {
        this.http = http;
        this.fileStatus = null;
        this.environment = environment;
        this.apiBaseURI = this.environment.committee_api_url + api_config_1.ApiConfig.basePathExt;
        this.apiBaseURI3 = this.environment.file_api + api_config_1.ApiConfig.basePathFile;
    }
    FileServiceService.prototype.getFileById = function (fileId, userId) {
        var url = this.apiBaseURI + ("/file/getByFileId?fileId=" + fileId + "&userId=" + userId);
        return this.http.get(url);
    };
    FileServiceService.prototype.createNote = function (body) {
        var url = this.environment.file_api + (":8078/kla/service/v1/files/" + body.fileId + "/notes");
        return this.http.post(url, body);
    };
    // update notes
    FileServiceService.prototype.updateNote = function (body) {
        var url = this.environment.file_api + (":8078/kla/service/v1/files/" + body.fileId + "/notes");
        return this.http.put(url, body);
    };
    // get notes
    FileServiceService.prototype.getAllNotes = function (fileId) {
        var url = this.environment.file_api + (":8078/kla/service/v1/files/" + fileId + "/notes");
        return this.http.get(url);
    };
    FileServiceService.prototype.deleteNoteById = function (reqBody) {
        return this.http.request('DELETE', this.environment.file_api + (":8078/kla/service/v1/files/" + reqBody.fileId + "/notes/byId"), { body: reqBody });
    };
    FileServiceService.prototype.checkWorkFlowStatus = function (workFlowId) {
        var url = this.environment.file_api + (":9000/kla/workflow/service/v1/task/tracking?processInstanceId=" + workFlowId);
        return this.http.get(url);
    };
    FileServiceService.prototype.getPendingFiles = function (userId, assembly, session, type) {
        return this.http.get(this.apiBaseURI3 +
            ("/pending/type?userId=" + userId + "&assemblyId=" + assembly + "&sessionId=" + session + "&type=" + type));
    };
    FileServiceService.prototype.getWorkflowActionUsers = function (workFlowId, fileId) {
        return this.http.get(this.environment.file_api + (":8078/kla/service/v1/files/getWorkflowActionUsers?workflowId=" + workFlowId + "&fileId=" + fileId));
    };
    FileServiceService.prototype.forwardFile = function (body, fileId) {
        return this.http.put(this.apiBaseURI3 + ("/" + fileId + "/forward"), body).pipe(operators_1.map(function (res) {
            return res;
        }));
    };
    FileServiceService.prototype.approveFile = function (body) {
        if (body === void 0) { body = {}; }
        var url = this.apiBaseURI + "/file/approve";
        return this.http.put(url, body);
    };
    FileServiceService.prototype.getAllFiles = function (body) {
        return this.http.post(this.apiBaseURI3 + "/getAll", body);
    };
    FileServiceService.prototype.approvedByHigherOfficial = function (userId) {
        return this.http.get(this.apiBaseURI3 + ("/all/ownerId?userId=" + userId));
    };
    FileServiceService.prototype.createFile = function (body) {
        return this.http.post(this.apiBaseURI + "/file/createFile", body);
    };
    FileServiceService.prototype.attachToFile = function (body) {
        return this.http.post(this.apiBaseURI + "/file/resubmitFile", body);
    };
    FileServiceService.prototype.reSubmitFile = function (body) {
        var url = this.apiBaseURI + "/file/resubmitFile";
        return this.http.post(url, body);
    };
    FileServiceService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(0, core_1.Inject("environment"))
    ], FileServiceService);
    return FileServiceService;
}());
exports.FileServiceService = FileServiceService;
