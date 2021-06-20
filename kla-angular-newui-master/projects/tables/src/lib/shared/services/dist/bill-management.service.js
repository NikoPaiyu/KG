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
exports.BillManagementService = void 0;
var core_1 = require("@angular/core");
var api_config_1 = require("../config/api.config");
var BillManagementService = /** @class */ (function () {
    function BillManagementService(environment, http) {
        this.http = http;
        this.environment = environment;
        this.apiBaseURI = this.environment.bill_api_url + api_config_1.ApiConfig.basePathExt;
        this.portfolioURI =
            this.environment.portfolio_mock_api_url + api_config_1.ApiConfig.portfolio;
    }
    BillManagementService.prototype.uploadUrl = function () {
        return "http://45.249.111.246" + api_config_1.ApiConfig.uploadFile;
    };
    // start bill list services
    BillManagementService.prototype.getAllBills = function (filterbody) {
        return this.http.post(this.apiBaseURI + "/all", filterbody);
    };
    BillManagementService.prototype.getAllRegisterBills = function (filterbody) {
        return this.http.post(this.apiBaseURI + "/register/all", filterbody);
    };
    BillManagementService.prototype.getBillsForAction = function (filterbody) {
        return this.http.put(this.apiBaseURI + "/getList", filterbody);
    };
    BillManagementService.prototype.assignToAssistant = function (body) {
        return this.http.post(this.apiBaseURI + "/assignToAssistant", body);
    };
    // end bill list services
    // start errata services
    BillManagementService.prototype.addErrata = function (body) {
        return this.http.post(this.apiBaseURI + "/errata", body);
    };
    BillManagementService.prototype.getAllErrata = function () {
        return this.http.get(this.apiBaseURI + "/errata/all");
    };
    BillManagementService.prototype.getErrataForAction = function (body) {
        return this.http.post(this.apiBaseURI + "/errata/errataByUser", body);
    };
    BillManagementService.prototype.sentErrataToApprover = function (errataId) {
        return this.http.post(this.apiBaseURI + ("/errata/sendToApprover/" + errataId), errataId);
    };
    BillManagementService.prototype.sentErrataToSection = function (errataId) {
        return this.http.post(this.apiBaseURI + ("/errata/sendToSection/" + errataId), errataId);
    };
    BillManagementService.prototype.assignErratatoAssistant = function (body) {
        return this.http.post(this.apiBaseURI + "/errata/assignToAssistant", body);
    };
    BillManagementService.prototype.attachErrataToFile = function (body) {
        return this.http.post(this.apiBaseURI + "/file/resubmitFile", body);
    };
    BillManagementService.prototype.closeErrata = function (errataId) {
        return this.http.post(this.apiBaseURI + ("/errata/closeErrata/" + errataId), errataId);
    };
    //balloting file
    BillManagementService.prototype.attachBallotingToFile = function (body) {
        return this.http.post(this.apiBaseURI + "/file/resubmitFile", body);
    };
    // end  errata services
    //start create bill services
    BillManagementService.prototype.getBillByBillId = function (billId) {
        var url = this.apiBaseURI + ("/" + billId);
        return this.http.get(url);
    };
    BillManagementService.prototype.getBillById = function (billId) {
        var url = this.apiBaseURI + ("/" + billId + "/register");
        return this.http.get(url);
    };
    BillManagementService.prototype.createBillBlocks = function (body) {
        var url = this.apiBaseURI + "/block";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.removeBlock = function (blockId) {
        var url = this.apiBaseURI + ("/block/deleteById?id=" + blockId);
        return this.http["delete"](url);
    };
    BillManagementService.prototype.submitBill = function (body) {
        var url = this.apiBaseURI + "/submit";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.approveAndSendBill = function (body) {
        var url = this.apiBaseURI + "/sendToSection";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.submitByAssistant = function (body) {
        var url = this.apiBaseURI + "/submittedByAssistant";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getBillTypes = function () {
        return this.http.get("");
    };
    BillManagementService.prototype.getBillReferences = function () {
        return this.http.get("");
    };
    BillManagementService.prototype.getBillLanguages = function () {
        return this.http.get("");
    };
    BillManagementService.prototype.getDepartments = function () {
        return this.http.get("");
    };
    BillManagementService.prototype.getMinisters = function () {
        return this.http.get("");
    };
    BillManagementService.prototype.saveBill = function (data) {
        return this.http.post("", data);
    };
    BillManagementService.prototype.createFile = function (body) {
        return this.http.post(this.apiBaseURI + api_config_1.ApiConfig.bill.createFile, body);
    };
    // end create bill services
    // send minister
    BillManagementService.prototype.createMinisterMotion = function (body) {
        var url = this.apiBaseURI + "/ministerMotion";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.processMotionTemplate = function (BillDetails) {
        // tslint:disable-next-line: max-line-length
        var committie = {
            SUBJECT_COMMITTEE: "സബ്ജക്ട്",
            SELECT_COMMITTEE: "സെലക്ട്"
        };
        var template = "<p>\u0D38\u0D7C,</p><p><br></p><p>\u0D35\u0D3F\u0D37\u0D2F\u0D02: [BillTitles]</p><p>\u0D0E\u0D28\u0D4D\u0D28\u0D3F\u0D35\u0D2F\u0D41\u0D1F\u0D46 \u0D05\u0D35\u0D24\u0D30\u0D23\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D41\u0D36\u0D47\u0D37\u0D2E\u0D41\u0D33\u0D4D\u0D33 \u0D2A\u0D4D\u0D30\u0D2E\u0D47\u0D2F\u0D02 \u0D38\u0D02\u0D2C\u0D28\u0D4D\u0D27\u0D3F\u0D1A\u0D4D\u0D1A\u0D41</p><p><br></p><p><br></p><p>[BillTitles] \u0D0E\u0D28\u0D4D\u0D28\u0D3F\u0D35 \u0D28\u0D3F\u0D2F\u0D2E\u0D38\u0D2D\u0D2F\u0D3F\u0D7D \u0D05\u0D35\u0D24\u0D30\u0D3F\u0D2A\u0D4D\u0D2A\u0D3F\u0D1A\u0D4D\u0D1A \u0D36\u0D47\u0D37\u0D02 \u0D06\u0D2F\u0D35 \u0D2C\u0D28\u0D4D\u0D27\u0D2A\u0D4D\u0D2A\u0D46\u0D1F\u0D4D\u0D1F [Commitie] \u0D15\u0D2E\u0D4D\u0D2E\u0D3F\u0D31\u0D4D\u0D31\u0D3F\u0D2F\u0D41\u0D1F\u0D46 \u0D2A\u0D30\u0D3F\u0D17\u0D23\u0D2F\u0D4D\u0D15\u0D4D \u0D35\u0D3F\u0D1F\u0D23\u0D2E\u0D46\u0D28\u0D4D\u0D28 \u0D2A\u0D4D\u0D30\u0D2E\u0D47\u0D2F\u0D02 \u0D05\u0D35\u0D24\u0D30\u0D3F\u0D2A\u0D4D\u0D2A\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D35\u0D3E\u0D7B \u0D2A\u0D4D\u0D30\u0D38\u0D4D\u0D24\u0D41\u0D24 \u0D2C\u0D3F\u0D32\u0D4D\u0D32\u0D41\u0D15\u0D33\u0D41\u0D1F\u0D46 \u0D1A\u0D41\u0D2E\u0D24\u0D32 \u0D35\u0D39\u0D3F\u0D15\u0D4D\u0D15\u0D41\u0D28\u0D4D\u0D28 \u0D2C\u0D39\u0D41\u0D03 [Minister] \u0D0E\u0D28\u0D4D\u0D28 \u0D35\u0D3F\u0D35\u0D30\u0D02 \u0D05\u0D31\u0D3F\u0D2F\u0D3F\u0D1A\u0D4D\u0D1A\u0D41\u0D15\u0D4A\u0D33\u0D4D\u0D33\u0D41\u0D28\u0D4D\u0D28\u0D41.</p>";
        template = template
            .split("[BillTitles]")
            .join(BillDetails.titles.join(","));
        if (BillDetails.minister) {
            template = template.replace("[Minister]", BillDetails.minister);
        }
        else {
            template = template.replace("[Minister]", BillDetails.minister);
        }
        template = template.replace("[Commitie]", committie[BillDetails.committie]);
        return template;
    };
    BillManagementService.prototype.submitGeneralAmendment = function (body) {
        var url = this.apiBaseURI + "/amendment";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getGeneralAmendmentList = function () {
        var url = this.apiBaseURI + "/amendment/report";
        return this.http.get(url);
    };
    BillManagementService.prototype.getAmendmentListByBillId = function (billId) {
        var url = this.apiBaseURI + ("/amendment/getByBill/" + billId);
        return this.http.get(url);
    };
    BillManagementService.prototype.addToRegister = function (body) {
        console.log("body", body);
        var url = this.apiBaseURI + ("/" + body.billId + "/register");
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getOrdDisApprovalList = function () {
        var url = this.apiBaseURI + "/ordinanceDisapproval/report/user";
        return this.http.get(url);
    };
    BillManagementService.prototype.getObjToIntroductionList = function () {
        var url = this.apiBaseURI + "/objection/introduction/report/user";
        return this.http.get(url);
    };
    BillManagementService.prototype.getGenAmendmentList = function () {
        var url = this.apiBaseURI + "/amendment/report/user";
        return this.http.get(url);
    };
    BillManagementService.prototype.getAllBillsNotAddedInPriorityList = function () {
        return this.http.get(this.apiBaseURI + "/priorityList/list/unAssigned/bills");
    };
    BillManagementService.prototype.getClauseByClauseList = function () {
        var url = this.apiBaseURI + "/clause/getByMemberId";
        return this.http.get(url);
    };
    BillManagementService.prototype.getdataList = function (body) {
        console.log(body);
        var url = this.apiBaseURI + "/ballot/getListByNoticeType";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getSecondList = function (body) {
        var url = this.apiBaseURI + "/ballot/getListByNoticeType";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getBallotList = function (body) {
        var url = this.apiBaseURI + "/ballot/getListByNoticeType";
        return this.http.post(url, body);
    };
    BillManagementService.prototype.getListByBallotId = function (id) {
        var url = this.apiBaseURI + ("/ballot/getById/" + id);
        return this.http.get(url);
    };
    BillManagementService.prototype.getApprovedBillList = function () {
        var url = this.apiBaseURI + "/act/getAll";
        return this.http.get(url);
    };
    BillManagementService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __param(0, core_1.Inject("environment"))
    ], BillManagementService);
    return BillManagementService;
}());
exports.BillManagementService = BillManagementService;
