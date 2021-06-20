"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BillAmendmentsRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var bill_amendments_component_1 = require("./bill-amendments.component");
var obj_introduction_component_1 = require("./obj-introduction/obj-introduction.component");
var obj_introduction_list_component_1 = require("./obj-introduction-list/obj-introduction-list.component");
var ordinance_disapproval_component_1 = require("./ordinance-disapproval/ordinance-disapproval.component");
var ord_disapproval_list_component_1 = require("./ord-disapproval-list/ord-disapproval-list.component");
var general_amendment_component_1 = require("./general-amendment/general-amendment.component");
var general_amendment_list_component_1 = require("./general-amendment-list/general-amendment-list.component");
var clause_by_clause_amendments_component_1 = require("./clause-by-clause-amendments/clause-by-clause-amendments.component");
var obj_intoduction_view_component_1 = require("./obj-introduction-process-flow/obj-intoduction-view/obj-intoduction-view.component");
var notes_component_1 = require("./obj-introduction-process-flow/notes/notes.component");
var obj_intoduction_notices_component_1 = require("./obj-intoduction-notices/obj-intoduction-notices.component");
var obj_introduction_process_flow_component_1 = require("./obj-introduction-process-flow/obj-introduction-process-flow/obj-introduction-process-flow.component");
var create_clause_by_clause_amendments_component_1 = require("./create-clause-by-clause-amendments/create-clause-by-clause-amendments.component");
var lists_component_1 = require("./lists/lists.component");
var routes = [
    {
        path: "",
        component: bill_amendments_component_1.BillAmendmentsComponent,
        children: [
            {
                path: "",
                redirectTo: "bill-amendments"
            },
            {
                path: "obj-introduction",
                component: obj_introduction_component_1.ObjIntroductionComponent
            },
            {
                path: "obj-introduction-list/:id",
                component: obj_introduction_list_component_1.ObjIntroductionListComponent
            },
            {
                path: "ordinance-disapproval",
                component: ordinance_disapproval_component_1.OrdinanceDisapprovalComponent
            },
            {
                path: "ordinance-disapproval-list/:id",
                component: ord_disapproval_list_component_1.OrdDisapprovalListComponent
            },
            {
                path: 'general-amendment-1',
                component: general_amendment_component_1.GeneralAmendmentComponent
            },
            {
                path: 'general-amendment-list/:id',
                component: general_amendment_list_component_1.GeneralAmendmentListComponent
            },
            {
                path: 'clause-by-clause',
                component: clause_by_clause_amendments_component_1.ClauseByClauseAmendmentsComponent
            },
            {
                path: 'create-clause-by-clause/:id',
                component: create_clause_by_clause_amendments_component_1.CreateClauseByClauseAmendmentsComponent
            },
            {
                path: 'obj-intro-view',
                component: obj_intoduction_view_component_1.ObjIntoductionViewComponent
            },
            {
                path: 'notes',
                component: notes_component_1.NotesComponent
            },
            {
                path: 'obj-introduction-notices',
                component: obj_intoduction_notices_component_1.ObjIntoductionNoticesComponent
            },
            {
                path: 'obj-introduction-process-flow/:id',
                component: obj_introduction_process_flow_component_1.ObjIntroductionProcessFlowComponent
            },
            {
                path: 'lists',
                component: lists_component_1.ListsComponent
            },
        ]
    }
];
var BillAmendmentsRoutingModule = /** @class */ (function () {
    function BillAmendmentsRoutingModule() {
    }
    BillAmendmentsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], BillAmendmentsRoutingModule);
    return BillAmendmentsRoutingModule;
}());
exports.BillAmendmentsRoutingModule = BillAmendmentsRoutingModule;
