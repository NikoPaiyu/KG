import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillAmendmentsService } from '../shared/bill-amendments.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { BillBlockService } from '../shared/bill-block.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'lib-create-clause-by-clause-amendments',
  templateUrl: './create-clause-by-clause-amendments.component.html',
  styleUrls: ['./create-clause-by-clause-amendments.component.css'],
})
export class CreateClauseByClauseAmendmentsComponent implements OnInit {
  isView = false;
  selectedBlockIndex: any = {};
  primaryMemberId;
  approvedBillContent: any = [];
  selectedBlockEntireDetails: any = [];
  billId = 0;
  editedWord = null;
  showPreview = true;
  currentUser;
  billDetails;
  amendments = [];
  replaceWord = 'REPLACE';
  disableActions = true;
  validateForm: FormGroup;
  showRowColumnCountModel = false;
  approvedBillList: any;
  showApprovedBillModel = false;
  showApprovedBillSelectModel = false;
  importTypeId: number;
  allowOralAmendment = false;
  @Output() blockCreated = new EventEmitter<boolean>();
  tempApprovedBillList: any;
  amendment = {
    id: null,
    billId: null,
    officialAmendment: false,
    blockId: null,
    operation: '',
    insertedWord: '',
    startingIndex: 0,
    endingIndex: 0,
    selectedWord: '',
    userId: null,
    typeId: null,
    parentId: null,
    blockIndex: null,
    content: null,
    amendmentType: null,
    assignedTo: null
  };
  selectedBlockDetails: any = {
    parentBlock: [],
    currentBlock: [],
    type: '',
  };
  rbsPermission = {
    validation: false,
    apply: false,
    edit: false,
    submission: false,
  };
  mlaList = [];
  amendModalVisible = false;
  purpose = '';
  billOralAmendmentId: any;
  billFileId: any;
  billStatus;
  canAttachToFile: any;
  constructor(
    private route: ActivatedRoute,
    @Inject('authService') private AuthService,
    private commonService: BillcommonService,
    private billService: BillManagementService,
    private amendmentService: BillAmendmentsService,
    private notify: NzNotificationService,
    public blockService: BillBlockService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    if (this.route.snapshot.params.id) {
      this.billId = this.route.snapshot.params.id;
      this.purpose = this.route.snapshot.params.readonly;
      this.amendment.billId = this.billId;
      this.getBill(this.billId);
    }
    this.currentUser = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.createTableRowColumnForm();
    this.resetAmendment();
    this.getRbsPermissionsinList();
    this.getAllMlas();
    if (this.purpose === 'view') {
      this.isView = true;
    }
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('AMENDMENT_VALIDATION', 'READ')) {
      this.rbsPermission.validation = true;
    }
    if (this.commonService.doIHaveAnAccess('AMENDMENT_VALIDATION', 'READ')) {
      this.rbsPermission.apply = true;
    }
    if (this.commonService.doIHaveAnAccess('CLAUSE_BY_CLAUSE', 'SUBMIT')) {
      this.rbsPermission.submission = true;
    }
  }

  getBill(billId) {
    this.billService.getBillByBillIdwithAmend(billId).subscribe((res) => {
      this.billDetails = res;
      this.billDetails.blocks = this.billDetails.blocks.filter(
        (ele) => ele.content
      );
      if (this.isMLA()) {
        this.getAmendmentsOfBill(this.billId, this.currentUser.userId);
      } else if (this.isPPO()) {
        if (this.primaryMemberId) {
          this.getAmendmentsOfBill(this.billId, this.primaryMemberId);
        } else {
          this.transFormContent();
        }
      } else {
        this.getAssistantBillview(this.billId);
      }
      this.disableActions = this.disableBill();
    });
  }
  getAssistantBillview(billId) {
    const isSectionOfficer = this.AuthService.getCurrentUser().authorities.includes(
      'sectionOfficer'
    );
    let body;
    if (isSectionOfficer) {
      body = {
        billId,
        status: 'SUBMITTED',
      };
    } else {
      body = {
        assignedTo: this.AuthService.getCurrentUser().userId,
        billId,
        status: null,
      };
    }
    this.amendmentService
      .getClauseNoticesListByBillId(body)
      .subscribe((data) => {
        if (data) {
          const response = data as any;
          if (response) {
            this.amendments = response.bilClauseAmendmentResponse;
            this.billStatus = response.billStatus;
            this.allowOralAmendment = (response.billStatus === 'PASSED');
            this.billFileId = response.billFileId;
            if(response.stage ! === 'PASSED') {
              this.canAttachToFile = true;
            } else { this.canAttachToFile = false; }
          }
          this.transFormContent();
        }
      });
  }
  getAmendmentsOfBill(billId, memberId) {
    if (this.allowOralAmendment) {
      this.getAssistantBillview(this.billId);
    } else {
      this.amendmentService
        .getAmendmentsOfBillByMember(billId, memberId)
        .subscribe((res: any) => {
          this.amendments = res;
          this.transFormContent();
        });
    }
  }
  onSelectText(block) {
    const selectedStringLength = document.getSelection().toString().trim().length;
    if (this.showPreview || this.disableActions || block.status === 'INACTIVE' || selectedStringLength < 1) {
      return;
    }
    if (!(this.isMLA() || this.isPPO() || this.allowOralAmendment)) {
      return;
    }
    if (
      !(
        (this.isPPO() && this.primaryMemberId) ||
        (!this.isPPO() && this.currentUser.userId) ||
        (this.allowOralAmendment && this.primaryMemberId)
      )
    ) {
      return;
    }
    this.resetAmendment();
    if (
      document.getSelection() &&
      document.getSelection().toString() &&
      !document.getSelection().isCollapsed &&
      document.getSelection().getRangeAt(0).startOffset !==
      document.getSelection().getRangeAt(0).endOffset
    ) {
      this.amendment.blockId = block.id;
      this.amendment.startingIndex = document
        .getSelection()
        .getRangeAt(0).startOffset;
      if (this.amendment.startingIndex < 0) {
        this.amendment.startingIndex = 0;
      }
      this.amendment.endingIndex =
        document.getSelection().getRangeAt(0).endOffset - 1;
      this.amendment.selectedWord = document.getSelection().toString();
      this.amendModalVisible = true;
    }
  }

  onCancelAmendModal() {
    this.amendModalVisible = false;
    this.resetAmendment();
  }
  onSelectAmendmentType(type) {
    if (type === 'REPLACE') {
      const words = this.getSelectedWordCount();
      if (words > 1) {
        this.amendment.operation = 'RECAST';
      } else {
        this.amendment.operation = 'REPLACE';
      }
    } else {
      this.amendment.operation = type;
    }
  }
  deleteAmendment(blockId) {
    this.amendment.operation = 'WHOLE_DELETE';
    this.amendment.blockId = blockId;
    this.amendModalVisible = true;
  }
  insertblockAmendment(index, typeId, code, parentBlock, currentBlock, type) {
    this.amendment.operation = 'WHOLE_INSERT';
    this.amendment.blockIndex = Number(index) + 1;
    this.amendment.typeId = typeId;
    this.selectedBlockDetails.parentBlock = parentBlock;
    this.selectedBlockDetails.currentBlock = currentBlock;
    this.selectedBlockDetails.type = type;
    if (type.code == "SECTION") {
      const index = currentBlock.type.code == "CLAUSE" || currentBlock.type.code == "MARGINAL_HEADING" ? 1 : currentBlock.index + 1;
      this.getApprovedBillList(index, 8);
    }
    else if (type.code == "SUB_SECTION") {
      this.getApprovedBillContentByBlockId(this.selectedBlockDetails.parentBlock, this.selectedBlockDetails.currentBlock, 10);
    }
    else {
      this.amendModalVisible = true;
    }

  }
  getSelectedWordCount() {
    if (this.amendment.selectedWord && this.amendment.selectedWord.length > 0) {
      const words = this.amendment.selectedWord.split(' ');
      return words.length;
    } else {
      return 0;
    }
  }

  saveAmendment() {
    const nonWordOperations = ['WHOLE_DELETE', 'DELETE'];
    if(this.amendment.insertedWord.trim().length < 1 && !nonWordOperations.includes(this.amendment.operation)) {
      this.notify.warning('Warning', 'atleast one charecter is required');
      return;
    }
    if (!this.amendment.userId) {
      this.amendment.userId = (this.isPPO() || this.allowOralAmendment)
        ? this.primaryMemberId
        : this.currentUser.userId;
    }
    if (!this.amendment.amendmentType) {
      if (this.allowOralAmendment) {
        this.amendment.amendmentType = 'ORAL_AMENDMENT';
        this.amendment.assignedTo = this.currentUser.userId;
      } else {
        this.amendment.amendmentType = 'AMENDMENT';
      }
    }
    this.amendment.officialAmendment = this.officialAmendmentCheck(
      this.billDetails,
      this.currentUser.userId
    );
    this.addBlocks(this.selectedBlockDetails, this.amendment.insertedWord);
    this.amendmentService
      .submitClauseByClauseAmendments(this.amendment)
      .subscribe((res) => {
        this.getBill(this.billId);
        if (this.amendment.id) {
          this.notify.success('Success', 'Amendment updated successfully');
        } else {
          this.notify.success('Success', 'Amendment created successfully');
        }
        this.onCancelAmendModal();
      });
  }

  submitAmendments() {
    const savedAmendments = this.amendments.filter((x) => x.status === 'SAVED');
    if (savedAmendments.length > 0) {
      const amendmentIds = savedAmendments.map((x) => x.id);
      const body = {
        noticeIds: amendmentIds,
      };
      this.amendmentService.submitAmendments(body).subscribe((data) => {
        this.notify.success('Success', 'Amendments submitted successfully');
        const userId = (this.isPPO() || this.allowOralAmendment) ? this.primaryMemberId : this.currentUser.userId;
        this.getAmendmentsOfBill(this.billId, userId);
      });
    } else {
      this.notify.warning('Warning', 'There are no saved amendments to submit');
    }
  }

  resetAmendment() {
    this.amendment = {
      id: null,
      billId: this.billId,
      officialAmendment: false,
      blockId: null,
      operation: '',
      insertedWord: '',
      startingIndex: 0,
      endingIndex: 0,
      selectedWord: '',
      userId: (this.isPPO() || this.allowOralAmendment) ? this.primaryMemberId : this.currentUser.userId,
      parentId: null,
      typeId: null,
      blockIndex: null,
      content: null,
      amendmentType: null,
      assignedTo: null
    };
  }

  backToList() {
    window.history.back();
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }
  transFormContent() {
    if (
      this.amendments &&
      this.billDetails &&
      this.billDetails.blocks &&
      this.amendments.length > 0 &&
      this.billDetails.blocks.length > 0
    ) {
      for (const block of this.billDetails.blocks) {
        block.AmendmentView = this.viewChange(block);
        for (const item of block.subBlockDto) {
          item.AmendmentView = this.viewChange(item);
          for (const obj of item.subBlockDto) {
            obj.AmendmentView = this.viewChange(obj);
            for (const ele of obj.subBlockDto) {
              ele.AmendmentView = this.viewChange(ele);
              for (const el of ele.subBlockDto) {
                el.AmendmentView = this.viewChange(el);
                for (const e of el.subBlockDto) {
                  e.AmendmentView = this.viewChange(e);
                }
              }
            }
          }
        }
      }
    } else {
      if (this.billDetails && this.billDetails.blocks) {
        for (const item of this.billDetails.blocks) {
          item.AmendmentView = item.content;
        }
      }
    }
  }
  viewChange(block) {
    const wordArray = block.content.split(' ');
    const amendments = this.amendments.filter((x) => x.blockId === block.id);
    if (
      wordArray &&
      amendments &&
      wordArray.length > 0 &&
      amendments.length > 0
    ) {
      for (const x of amendments) {
        if (!x.checked && !x.applied) {
          x.checked = true;
          const word = wordArray[x.wordPosition - 1];
          if (x.operationType === 'INSERTBEFORE') {
            let amendsInSameIndex = amendments.filter(
              (y) =>
                y.wordPosition === x.wordPosition &&
                x.operationType === y.operationType
            );
            amendsInSameIndex = this.getSortedAmendmentByTime(
              amendsInSameIndex
            );
            let words = '';
            if (amendsInSameIndex.length > 1) {
              words = `<div class="dropdown"><span class="insertion">${amendsInSameIndex[0].word}</span>`;
              amendsInSameIndex.splice(0, 1);
              words += `<div class="dropdown-content">`;
              amendsInSameIndex.forEach((el) => {
                words = words + `<p class="insertion">${el.word}</p>`;
                const index = this.amendments.findIndex((z) => z.id === el.id);
                this.amendments[index].checked = true;
              });
              words += `</div></div>`;
              words += word;
            } else {
              words = `<span class="insertion">${x.word}</span>` + word;
            }
            wordArray[x.wordPosition - 1] = words;
          }
          if (x.operationType === 'INSERTAFTER') {
            let amendsInSameIndex = amendments.filter(
              (y) =>
                y.wordPosition === x.wordPosition &&
                x.operationType === y.operationType
            );
            amendsInSameIndex = this.getSortedAmendmentByTime(
              amendsInSameIndex
            );
            let words = '';
            if (amendsInSameIndex.length > 1) {
              words =
                word +
                `<div class="dropdown"><span class="insertion">${amendsInSameIndex[0].word}</span>`;
              amendsInSameIndex.splice(0, 1);
              words = words + `<div class="dropdown-content">`;
              amendsInSameIndex.forEach((el) => {
                const index = this.amendments.findIndex((z) => z.id === el.id);
                this.amendments[index].checked = true;
                words = words + `<p class="insertion">${el.word}</p>`;
              });
              words = words + `</div></div>`;
            } else {
              words = `<span class="insertion">${x.word}</span>` + word;
            }
            wordArray[x.wordPosition - 1] = words;
          }
          if (x.operationType === 'REPLACE') {
            let amendsInSameIndex = amendments.filter(
              (y) =>
                y.wordPosition === x.wordPosition &&
                x.operationType === y.operationType
            );
            amendsInSameIndex = this.getSortedAmendmentByTime(
              amendsInSameIndex
            );
            let words = '';
            if (amendsInSameIndex.length > 1) {
              words = `<div class="dropdown"><span class="replacement">${amendsInSameIndex[0].word}</span>`;
              amendsInSameIndex.splice(0, 1);
              words = words + `<div class="dropdown-content">`;
              amendsInSameIndex.forEach((el) => {
                const index = this.amendments.findIndex((z) => z.id === el.id);
                this.amendments[index].checked = true;
                words = words + `<p class="replacement">${el.word}</p>`;
              });
              words = words + `</div></div>`;
            } else {
              words = `<span class="replacement">${x.word}</span>`;
              let wordCount = this.getWordCount(x.selectedWord);
              wordCount--;
              while (wordCount > 0) {
                wordArray[x.wordPosition - 1 + wordCount] = '';
                wordCount--;
              }
            }
            wordArray[x.wordPosition - 1] = words;
          }
          if (x.operationType === 'RECAST') {
            let amendsInSameIndex = amendments.filter(
              (y) =>
                y.wordPosition === x.wordPosition &&
                x.operationType === y.operationType
            );
            amendsInSameIndex = this.getSortedAmendmentByTime(
              amendsInSameIndex
            );
            let words = '';
            if (amendsInSameIndex.length > 1) {
              words = `<div class="dropdown"><span class="replacement">${amendsInSameIndex[0].word}</span>`;
              amendsInSameIndex.splice(0, 1);
              words = words + `<div class="dropdown-content">`;
              amendsInSameIndex.forEach((el) => {
                const index = this.amendments.findIndex((z) => z.id === el.id);
                this.amendments[index].checked = true;
                words = words + `<p class="replacement">${el.word}</p>`;
              });
              words = words + `</div></div>`;
            } else {
              words = `<span class="replacement">${x.word}</span>`;
              let wordCount = this.getWordCount(x.selectedWord);
              wordCount--;
              while (wordCount > 0) {
                wordArray[x.wordPosition - 1 + wordCount] = '';
                wordCount--;
              }
            }
            wordArray[x.wordPosition - 1] = words;
          }
          if (x.operationType === 'DELETE') {
            let amendsInSameIndex = amendments.filter(
              (y) =>
                y.wordPosition === x.wordPosition &&
                x.operationType === y.operationType
            );
            amendsInSameIndex = this.getSortedAmendmentByTime(
              amendsInSameIndex
            );
            let words = '';
            if (amendsInSameIndex.length > 1) {
              words = `<div class="dropdown"><span class="deletion">${amendsInSameIndex[0].word}</span>`;
              amendsInSameIndex.splice(0, 1);
              words = words + `<div class="dropdown-content">`;
              amendsInSameIndex.forEach((el) => {
                const index = this.amendments.findIndex((z) => z.id === el.id);
                this.amendments[index].checked = true;
                words = words + `<p class="deletion">${el.selectedWord}</p>`;
              });
              words = words + `</div></div>`;
            } else {
              words = `<span class="deletion">${x.selectedWord}</span>`;
            }
            wordArray[x.wordPosition - 1] = words;
          }
          if (x.operationType === 'WHOLE_INSERT') {
            wordArray[0] = `<span class="insertion">${wordArray[0]}`;
            wordArray[wordArray.length - 1] += '</span>';
          }
        }
      }
    }
    return wordArray.join(' ');
  }

  getSortedAmendmentByTime(amendOnSameIndex) {
    if (amendOnSameIndex && amendOnSameIndex.length > 0) {
      return amendOnSameIndex.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    }
    return [];
  }
  getWordCount(sentence) {
    if (sentence) {
      const wordArray = sentence.split(' ');
      return wordArray.length;
    } else {
      return 0;
    }
  }
  GetSortOrder(key) {
    return (a, b) => {
      if (a[key] > b[key]) {
        return 1;
      } else if (a[key] < b[key]) {
        return -1;
      }
      return 0;
    };
  }
  ShowOriginal(value) {
    this.showPreview = value;
  }
  updateStatus(status, amendmentId) {
    const body = {
      operation: 'UPDATE_STATUS',
      billId: this.billId,
      status,
      amedmentId: amendmentId,
    };
    this.amendmentService
      .updateAmendmentStatus(this.billId, body)
      .subscribe((data) => {
        this.notify.success('Success', 'Status updated succesfully');
        const index = this.amendments.findIndex((x) => x.id === amendmentId);
        this.amendments[index].status = status;
      });
  }
  editAmendment(data) {
    for (const item of this.amendments) {
      item.edit = false;
    }
    const index = this.amendments.findIndex((x) => x.id === data.id);
    this.amendments[index].edit = true;
    this.editedWord = data.word;
  }
  cancelEdit() {
    for (const item of this.amendments) {
      item.edit = false;
    }
    this.editedWord = null;
  }
  updateAmendment(id) {
    const index = this.amendments.findIndex((x) => x.id === id);
    this.amendments[index].edit = false;
    this.amendments[index].word = this.editedWord;
    const amendmentData = this.amendments[index];
    this.editedWord = null;
    const body = {
      id: amendmentData.id,
      billId: this.billId,
      blockId: amendmentData.blockId,
      operation: amendmentData.operationType,
      startingIndex: amendmentData.startingIndex,
      endingIndex: amendmentData.endingIndex,
      selectedWord: amendmentData.selectedWord,
      userId: amendmentData.memberId,
      insertedWord: this.amendments[index].word,
      officialAmendment: false,
      typeId: null,
      parentId: null,
      blockIndex: null,
      content: null,
      amendmentType: amendmentData.amendmentType,
      index: null,
      assignedTo: amendmentData.assignedTo
    };
    this.amendment = body;
    this.saveAmendment();
  }
  deleteAmendments(noticeId) {
    this.amendmentService.deleteAmendments(noticeId).subscribe((data) => {
      this.amendments = this.amendments.filter(x => x.id !== noticeId);
      this.getBill(this.billId);
      this.notify.success('Success', 'Amendment deleted successfully');
    });
  }
  applyAmendment(amendment) {
    if (amendment.amendmentType === 'AMENDMENT') {
      this.amendmentService.applyAmendment(amendment.id).subscribe(async (data) => {
        this.getBill(this.billId);
        this.showPreview = true;
        const index = this.amendments.findIndex(x => x.id === amendment.id);
        this.amendments[index].applied = true;
        this.notify.success('Success', 'Amendment applied successfully');
      });
    } else {
      amendment.billId = this.billId;
      this.amendmentService.applyOralAmendment(amendment).subscribe(async (data) => {
        this.getBill(this.billId);
        this.showPreview = true;
        const index = this.amendments.findIndex(x => x.id === amendment.id);
        this.amendments[index].applied = true;
        this.notify.success('Success', 'Amendment applied successfully');
      });
    }
  }
  isEditable(item) {
    let editable = false;
    const editableItems = ['INSERTBEFORE', 'INSERTAFTER', 'REPLACE', 'RECAST'];
    if (item.status === 'SAVED' && (this.isMLA() || this.isPPO()) && editableItems.indexOf(item.operationType) > -1) {
      editable = true;
    }
    if (item.status !== 'SAVED' && !this.isMLA() && editableItems.indexOf(item.operationType) > -1) {
      editable = true;
    }
    return editable;
  }
  officialAmendmentCheck(billDetails, currentUserId) {
    if (billDetails.ministerId === currentUserId) {
      return true;
    }
    if (!this.isMLA()) {
      return true;
    }
    return false;
  }
  restrictEditButton() { }
  disableBill() {
    if (this.billDetails.list2status) {
      return true;
    }
    return false;
  }
  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes('ppo') ||
      this.AuthService.getCurrentUser().authorities.includes(
        'parliamentaryPartySecretary'
      )
    );
  }
  getAllMlas() {
    if (this.isPPO()) {
      this.billService
        .getMemberByPpo(this.currentUser.userId)
        .subscribe((data) => {
          this.mlaList = data as any;
        });
    } else {
      this.billService.getAllMembersList().subscribe((data) => {
        this.mlaList = data as any;
      });
    }
  }
  showTitle(code) {
    const allowedTitles = ['MEMORANDUM_REGARDING_DELEGATED_LEGISLATION', 'FINANCIAL_MEMORANDUM', 'STATEMENT_OF_OBJECTS_AND_REASONS'];
    return allowedTitles.indexOf(code) > -1;
  }
  // funtion for create rows and column for
  createTableRowColumnForm() {
    this.validateForm = this.formBuilder.group({
      numberOfRows: [1],
      numberOfColumns: [1]
    });
  }
  createTable() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const newRow = [];
      const numberOfRows = this.validateForm.value.numberOfRows;
      const numberOfColumns = this.validateForm.value.numberOfColumns;
      for (let r = 0; r < numberOfRows; r++) {
        const columns = [];
        for (let c = 0; c < numberOfColumns; c++) {
          columns.push({
            id: c + 1, content: "", colSpan: 1, rowSpan: 1, cellIndex: c
          });
        }
        newRow.push({ columns: columns });
      }
      if (
        this.selectedBlockEntireDetails.currentBlock.type.code == 'CLAUSE' ||
        this.selectedBlockEntireDetails.currentBlock.type.code == 'SUB_CLAUSE'
      ) {
        this.setChilOfBlock(this.selectedBlockEntireDetails.parentBlock, this.selectedBlockEntireDetails.currentBlock, this.selectedBlockEntireDetails.type, newRow);
      } else {
        this.setSameLevelOfBlock(this.selectedBlockEntireDetails.parentBlock, this.selectedBlockEntireDetails.currentBlock, this.selectedBlockEntireDetails.type, newRow);
      }
      this.showRowColumnCountModel = false;
    }
  }
  // uncheck other check box in approved bill model table
  uncheckOtherCheckBox(checkedBillId) {
    this.approvedBillList.map((element) => {
      if (element.billId != checkedBillId) {
        element.checked = false;
      }
    });
  }
  // set the block to outer block
  setSuperParentBlock(parentBlock, type, content) {
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = null;
    this.amendment.billId = parentBlock.billId;
    this.amendment.blockIndex = parentBlock.index + 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  // set the block to the same level of current block
  setSameLevelOfBlock(parentBlock, currentBlock, type, content) {
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = parentBlock.id;
    this.amendment.billId = parentBlock.billId;
    this.amendment.blockIndex = currentBlock.index + 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  // set the block to the child of current block
  setChilOfBlock(parentBlock, currentBlock, type, content) {
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = currentBlock.id;
    this.amendment.billId = parentBlock.billId;
    this.amendment.blockIndex = 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  // search approved bill list
  searchApprovedBillList(searchParam) {
    if (searchParam) {
      this.approvedBillList = this.tempApprovedBillList.filter(
        (element) =>
          element.title &&
          element.title.toLowerCase().includes(searchParam.toLowerCase())
      );
    } else {
      this.approvedBillList = this.tempApprovedBillList;
    }
  }
  continueAndSelectSection() {
    const selectdAct = this.approvedBillList.find(
      (element) => element.checked === true
    );
    if (selectdAct) {
      this.billService
        .getBillByBillId(selectdAct.billId)
        .subscribe((res: any) => {
          this.approvedBillContent = res.blocks;
          this.approvedBillContent.map((element) => {
            element.defaultParentId = this.selectedBlockDetails.parentBlock.id;
            element.checked = false;
            element.upcommingIndex = this.selectedBlockIndex;
            element.defaultBillId = this.billDetails.id;
            element.upcommingTypeId = this.importTypeId;
            element.userId = (this.isPPO() || this.allowOralAmendment)
              ? this.primaryMemberId
              : this.currentUser.userId;
          });
          this.showApprovedBillModel = false;
          this.showApprovedBillSelectModel = true;
        });
    } else {
      this.notify.info('Info', 'Please select one act ...');
    }
  }
  // function will trigger when the import or cancel button click from component
  importOrCancel(event) {
    this.getBill(this.billId);
    this.showApprovedBillSelectModel = false;
  }
  // function to prevent keyboard
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
  }
  isDeletAllowed(code, status) {
    const restrictedBlocks = ['TITLE', 'LONG_TITLE', 'PREAMBLE', 'ENACTING_FORMULA', 'MARGINAL_HEADING'];
    return restrictedBlocks.indexOf(code) === -1 && status !== 'INACTIVE';
  }
  getContent(block) {
    const elementType = block.type.code;
    if (elementType === 'TABLE' || elementType === 'SCHEDULE') {
      return this.blockService.jsonToHtmlTable(block);
    } else {
      return block.content;
    }
  }
  getAmendedContent(block) {
    const elementType = block.type.code;
    if (elementType === 'TABLE' || elementType === 'SCHEDULE') {
      return this.blockService.jsonToHtmlTable(block);
    } else {
      return block.AmendmentView;
    }
  }


  addBlocks(selectedBlockDetails, content) {
    switch (selectedBlockDetails.type.code) {
      case 'CLAUSE': {
        this.setSuperParentBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.type, content);
        break;
      }
      case 'SUB_CLAUSE': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'MARGINAL_HEADING'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
          break;
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
          break;
        }
      }
      case 'ITEM': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'SUB_ITEM': {
        if (selectedBlockDetails.currentBlock.type.code == 'ITEM') {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'PROVISO': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'EXPLANATION': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'NOTE': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'PARAGRAPH': {
        if (selectedBlockDetails.currentBlock.type.code == 'PARAGRAPH') {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'CHAPTER': {
        if (
          selectedBlockDetails.currentBlock.type.code == 'CLAUSE' ||
          selectedBlockDetails.currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        } else {
          this.setSameLevelOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        }
        break;
      }
      case 'SCHEDULE': {
        this.showRowColumnCountModel = true;
        break;
      }
      case 'TABLE': {
        this.showRowColumnCountModel = true;
        break;
      }
      case 'DETAILS': {
        this.setChilOfBlock(selectedBlockDetails.parentBlock, selectedBlockDetails.currentBlock, selectedBlockDetails.type, content);
        break;
      }
    }
  }

  // get all approved bill content details by subsection click
  getApprovedBillContentByBlockId(parentBlock, currentBlock, typeId) {
    this.billService.getSubBlockByBlockId(parentBlock.id).subscribe((res) => {
      this.approvedBillContent = res;
      this.approvedBillContent.map((element) => {
        element.defaultParentId = parentBlock.id;
        element.checked = false;
        element.upcommingIndex =
          parentBlock.id == currentBlock.id ? 1 : currentBlock.index + 1;
        element.defaultBillId = this.billDetails.id;
        element.upcommingTypeId = typeId;
      });
      this.showApprovedBillModel = false;
      this.showApprovedBillSelectModel = true;
    });
  }
  //  open approved bill list
  getApprovedBillList(currentBlockIndex, typeId) {
    this.billService.getApprovedBillList().subscribe((res: any) => {
      this.selectedBlockIndex = currentBlockIndex;
      this.importTypeId = typeId;
      this.showApprovedBillModel = true;
      res.map((obj) => {
        obj.checked = false;
      });

      this.approvedBillList = res;
      this.tempApprovedBillList = res;
    });
  }
  resubmitFile() {
    const body = {
      billOralAmendmentId: this.billOralAmendmentId,
      fileForm: {
        billId: this.billId,
        type: 'BILL',
        fileId: this.billFileId,
        activeSubTypes: ['BILL_ORAL_AMENDMENT'],
        userId: this.currentUser.userId
      }
    };
    this.billService.attachBallotingToFile(body).subscribe(data => {
      if (data) {
        this.notify.success('Success', 'Attached to bill file successfully');
        this.router.navigate(['business-dashboard/bill/file-view/', this.billFileId]);
      }
    });
  }
  getAmendmentReportByBillId() {
    const billId = this.billId;
    this.amendmentService.getAmendmentReport(billId).subscribe(data => {
      if (data.id) {
        this.billOralAmendmentId = data.id;
        this.resubmitFile();
      } else { this.notify.error('Error', 'Something went wrong!'); }
    });
  }
}
