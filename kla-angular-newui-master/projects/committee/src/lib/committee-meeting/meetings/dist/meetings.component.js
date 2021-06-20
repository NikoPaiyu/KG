"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MeetingsComponent = void 0;
var core_1 = require("@angular/core");
var MeetingsComponent = /** @class */ (function () {
    function MeetingsComponent(service, router) {
        this.service = service;
        this.router = router;
        this.filtrParams = {};
        this.showFilePopup = false;
        this.searchMeet = null;
        this.result = [];
        this.allResult = [];
        this.tableParams = { colSpan: false };
        this.colCheckboxes = [
            { id: 0, label: 'title', check: true, disable: false },
            { id: 1, label: 'date', check: true, disable: false },
            { id: 2, label: 'venue', check: true, disable: false },
            { id: 3, label: 'joint', check: true, disable: false }
        ];
        this.showDetailsPopup = false;
    }
    MeetingsComponent.prototype.ngOnInit = function () {
        this._setFilter();
        this._getList();
    };
    MeetingsComponent.prototype.searchMeetList = function () {
    };
    // let type='GENERAL_AMENDMENT';
    MeetingsComponent.prototype._getList = function () {
        var _this = this;
        // this.service.getBillList().subscribe((Response) => {
        // this.result = this.allResult = new Array(5).fill(0).map((_, index) => {
        //   if (index < 6) {
        //     return {
        //       no: 332,
        //       id: index++,
        //       title: "The Kerala Appropriation(No.2) Bill, 2020",
        //       date: "malayalam",
        //       minister: "Dn. T M Thomas Isaac",
        //       dept: "Finance",
        //       status: "Status",
        //       viewLinks: false,
        //     };
        //   }
        this.service.getAllMeetingList().subscribe(function (Res) {
            _this.result = _this.allResult = Res;
            console.log(_this.result);
        });
        // });
        // });
    };
    MeetingsComponent.prototype.sort = function (sort) {
        var data = this.allResult.filter(function (item) { return item; });
        if (sort.key && sort.value) {
            this.result = data.sort(function (a, b) {
                return sort.value === "ascend"
                    ? a[sort.key].toLowerCase() > b[sort.key].toLowerCase()
                        ? 1
                        : -1
                    : b[sort.key].toLowerCase() > a[sort.key].toLowerCase()
                        ? 1
                        : -1;
            });
        }
        else {
            this.result = data;
        }
    };
    MeetingsComponent.prototype.disableCheckBox = function () {
        var count = 0;
        for (var _i = 0, _a = this.colCheckboxes; _i < _a.length; _i++) {
            var box = _a[_i];
            if (box.check) {
                count++;
            }
        }
        if (count === 6) {
            for (var _b = 0, _c = this.colCheckboxes; _b < _c.length; _b++) {
                var box = _c[_b];
                if (!box.check) {
                    box.disable = true;
                }
            }
        }
        else {
            for (var _d = 0, _e = this.colCheckboxes; _d < _e.length; _d++) {
                var box = _e[_d];
                box.disable = false;
            }
        }
    };
    MeetingsComponent.prototype.showLinks = function (id) {
        if (this.tableParams.colSpan) {
            return;
        }
        this.result.forEach(function (element) {
            if (element.id === id) {
                element.viewLinks = true;
            }
            else {
                element.viewLinks = false;
            }
        });
    };
    MeetingsComponent.prototype.hideLinks = function (id) {
        this.result.forEach(function (element) {
            if (element.id === id) {
                element.viewLinks = false;
            }
        });
    };
    // cancelBulletin() {
    //   this.showFilePopup=false;
    // }
    MeetingsComponent.prototype.showPopup = function (id) {
        if (id) {
            this.committeeId = id;
            this.showFilePopup = true;
        }
    };
    MeetingsComponent.prototype.showFilter = function (type) {
        // this.filtrParams.colFilter = type === "column" ? true : false;
        this.filtrParams.rowFilter = type === "row" ? true : false;
        this.filtrParams.showPriorityPopup = false;
    };
    MeetingsComponent.prototype._setFilter = function () {
        this.filtrParams.tableDto = [];
        var tableDataMdl = [
            { label: "Title", key: "Title" },
            { label: "Date", key: "Date" },
            { label: "Venue", key: "Venue" },
        ];
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < tableDataMdl.length; i++) {
            var row = {
                key: tableDataMdl[i].key,
                label: tableDataMdl[i].label,
                checked: false,
                filtersel: false,
                data: [],
                selValue: null,
                disableCol: false
            };
            this.filtrParams.tableDto.push(row);
        }
        this.filtrParams.colFilter = false;
        this.filtrParams.rowFilter = false;
        this.filtrParams.showPriorityPopup = false;
    };
    // showFilter(type) {
    //   // this.filtrParams.colFilter = type === "column" ? true : false;
    //   this.filtrParams.rowFilter = type === "row" ? true : false;
    //   this.filtrParams.showPriorityPopup = false;
    // }
    MeetingsComponent.prototype._confrmFilter = function () {
        if (this.filtrParams.colFilter) {
            this._filterCols();
        }
        else {
            this._filterRows();
        }
    };
    MeetingsComponent.prototype._filterCols = function () {
        this.filtrParams.colFilter = false;
        // this.filtrParams.tableDto.forEach((element) => {
        //   if (element.checked) {
        //     element.disableCol = true;
        //   }
        // });
    };
    MeetingsComponent.prototype._filterRows = function () {
        this.filtrParams.rowFilter = false;
        this.filtrParams.tableDto.forEach(function (element) {
            element.filtersel = element.checked;
        });
        this._loadSelectedfilterData();
    };
    MeetingsComponent.prototype._loadSelectedfilterData = function () {
        var _this = this;
        var count = 0;
        this.filtrParams.tableDto.forEach(function (element) {
            count++;
            if (element.filtersel) {
                switch (element.key) {
                    case "Title":
                        _this.allResult.forEach(function (value) {
                            element.data.push(value.title);
                        });
                        break;
                    case "Date":
                        _this.allResult.forEach(function (value) {
                            element.data.push(value.date);
                        });
                        break;
                    case "Venue":
                        _this.allResult.forEach(function (value) {
                            element.data.push(value.venue);
                        });
                        break;
                    // case "fileNo":
                    //   this.allClauseList.forEach((value) => {
                    //     element.data.push(value.fileNumber);
                    //   });
                    //   break;
                    // case "numberOfAmendments":
                    //   this.allClauseList.forEach((value) => {
                    //     element.data.push(value.numberOfNotices);
                    //   });
                    //   break;
                    // case "respondedmembers":
                    //     this.allClauseList.forEach((value) => {
                    //       element.data.push(value.ministerName);
                    //     });
                    //     break;  
                    // case "status":
                    //   this.allClauseList.forEach((value) => {
                    //     element.data.push(value.status);
                    //   });
                    //   break;
                    default:
                        break;
                }
            }
        });
        if (count === this.filtrParams.tableDto.length) {
            this.filtrParams.tableDto.forEach(function (element) {
                element.data = element.data.filter(function (v, i, a) { return a.indexOf(v) === i; });
            });
        }
    };
    MeetingsComponent.prototype._chooseFilter = function (box) {
        box.checked = !box.checked;
    };
    MeetingsComponent.prototype.searchCol = function () {
        var _this = this;
        if (!this.filtrParams.tableDto) {
            this.result = this.allResult;
        }
        else {
            this.result = this.allResult.filter(function (item) {
                return _this.applyFilter(item, _this.filtrParams.tableDto);
            });
        }
    };
    MeetingsComponent.prototype.applyFilter = function (element, filter) {
        for (var field in filter) {
            if (filter[field].selValue) {
                if (typeof filter[field].selValue === "string") {
                    if (!element[filter[field].key] ||
                        element[filter[field].key].toLowerCase() !==
                            filter[field].selValue.toLowerCase()) {
                        return false;
                    }
                }
                else if (typeof filter[field].selValue === "number") {
                    if (!element[filter[field].key] ||
                        element[filter[field].key] !== filter[field].selValue) {
                        return false;
                    }
                }
                else if (typeof filter[field].selValue === "object") {
                    if (!element[filter[field].key] ||
                        element[filter[field].key] !== filter[field].selValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    MeetingsComponent.prototype.disableFilter = function (filter) {
        filter.filtersel = false;
        filter.checked = false;
        filter.data = [];
        filter.selValue = null;
        this.searchCol();
        this._loadSelectedfilterData();
    };
    MeetingsComponent.prototype.clearFilter = function () {
        this._setFilter();
        this.searchCol();
        this._loadSelectedfilterData();
    };
    Object.defineProperty(MeetingsComponent.prototype, "checkedFilters", {
        get: function () {
            return this.filtrParams.tableDto.filter(function (ele) { return ele.filtersel; });
        },
        enumerable: false,
        configurable: true
    });
    MeetingsComponent.prototype.closeModal = function (event) {
        console.log(event);
        // if(!event){
        this.showFilePopup = event;
        // this._getList();
        // }
    };
    MeetingsComponent.prototype.showFile = function (id) {
        this.router.navigate(["business-dashboard/committee/file-view", id]);
    };
    MeetingsComponent.prototype.onCancelPopup = function () {
        this.showFilePopup = false;
    };
    MeetingsComponent.prototype.showMeetDetailsPopup = function () {
        this.showDetailsPopup = true;
    };
    MeetingsComponent.prototype.closeDetailsPopup = function () {
        this.showDetailsPopup = false;
    };
    MeetingsComponent.prototype.afterCreateMeeting = function (event) {
        if (event) {
            this._getList();
            this.closeDetailsPopup();
        }
    };
    MeetingsComponent.prototype.showMeeting = function (id) {
        this.router.navigate(['/business-dashboard/committee/meeting-view', id]);
    };
    MeetingsComponent = __decorate([
        core_1.Component({
            selector: 'committee-meetings',
            templateUrl: './meetings.component.html',
            styleUrls: ['./meetings.component.css']
        })
    ], MeetingsComponent);
    return MeetingsComponent;
}());
exports.MeetingsComponent = MeetingsComponent;
