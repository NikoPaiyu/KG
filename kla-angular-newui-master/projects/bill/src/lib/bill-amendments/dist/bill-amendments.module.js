"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BillAmendmentsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_zorro_antd_1 = require("ng-zorro-antd");
var core_2 = require("@ngx-translate/core");
var forms_1 = require("@angular/forms");
var bill_amendments_routing_module_1 = require("./bill-amendments-routing.module");
var obj_introduction_component_1 = require("./obj-introduction/obj-introduction.component");
var bill_amendment_list_component_1 = require("./bill-amendment-list/bill-amendment-list.component");
var bill_amendments_component_1 = require("./bill-amendments.component");
var obj_introduction_list_component_1 = require("./obj-introduction-list/obj-introduction-list.component");
var ordinance_disapproval_component_1 = require("./ordinance-disapproval/ordinance-disapproval.component");
var ord_disapproval_list_component_1 = require("./ord-disapproval-list/ord-disapproval-list.component");
var general_amendment_component_1 = require("./general-amendment/general-amendment.component");
var general_amendment_list_component_1 = require("./general-amendment-list/general-amendment-list.component");
var clause_by_clause_amendments_component_1 = require("./clause-by-clause-amendments/clause-by-clause-amendments.component");
var obj_introduction_process_flow_component_1 = require("./obj-introduction-process-flow/obj-introduction-process-flow/obj-introduction-process-flow.component");
var notes_component_1 = require("./obj-introduction-process-flow/notes/notes.component");
var obj_intoduction_view_component_1 = require("./obj-introduction-process-flow/obj-intoduction-view/obj-intoduction-view.component");
var obj_intoduction_notices_component_1 = require("./obj-intoduction-notices/obj-intoduction-notices.component");
var ngx_quill_1 = require("ngx-quill");
var bill_full_view_module_1 = require("../bill-full-view/bill-full-view.module");
var create_clause_by_clause_amendments_component_1 = require("./create-clause-by-clause-amendments/create-clause-by-clause-amendments.component");
var lists_component_1 = require("./lists/lists.component");
var BillAmendmentsModule = /** @class */ (function () {
    function BillAmendmentsModule() {
    }
    BillAmendmentsModule = __decorate([
        core_1.NgModule({
            declarations: [
                obj_introduction_component_1.ObjIntroductionComponent,
                bill_amendment_list_component_1.BillAmendmentListComponent,
                bill_amendments_component_1.BillAmendmentsComponent,
                obj_introduction_list_component_1.ObjIntroductionListComponent,
                ordinance_disapproval_component_1.OrdinanceDisapprovalComponent,
                ord_disapproval_list_component_1.OrdDisapprovalListComponent,
                general_amendment_component_1.GeneralAmendmentComponent,
                general_amendment_list_component_1.GeneralAmendmentListComponent,
                clause_by_clause_amendments_component_1.ClauseByClauseAmendmentsComponent,
                create_clause_by_clause_amendments_component_1.CreateClauseByClauseAmendmentsComponent,
                obj_introduction_process_flow_component_1.ObjIntroductionProcessFlowComponent,
                notes_component_1.NotesComponent,
                obj_intoduction_view_component_1.ObjIntoductionViewComponent,
                obj_intoduction_notices_component_1.ObjIntoductionNoticesComponent,
                lists_component_1.ListsComponent
            ],
            imports: [
                common_1.CommonModule,
                bill_amendments_routing_module_1.BillAmendmentsRoutingModule,
                ng_zorro_antd_1.NgZorroAntdModule,
                core_2.TranslateModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                ngx_quill_1.QuillModule.forRoot(),
                bill_full_view_module_1.BillFullViewModule
            ]
        })
    ], BillAmendmentsModule);
    return BillAmendmentsModule;
}());
exports.BillAmendmentsModule = BillAmendmentsModule;
