import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BlockSuggestService } from '../../shared/services/block-suggest.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { differenceInCalendarDays, parseISO } from 'date-fns';
@Component({
  selector: 'committee-add-clauses',
  templateUrl: './add-clauses.component.html',
  styleUrls: ['./add-clauses.component.css']
})
export class AddClausesComponent implements OnInit {
  reportDto = null
  validateForm: FormGroup;
  approvedBillList: any;
  approvedBillContent: any = [];
  markPopup = false;
  takenStatus = null;
  reportGen = false;
  isView = false;
  primaryMemberId;
  billId = 0;
  editedWord = null;
  showPreview = false;
  currentUser;
  billDetails;
  amendments = [];
  amendmentGroup =[];
  replaceWord = 'REPLACE';
  showRowColumnCountModel = false;
  disableActions = true;
  selectedBlockIndex;
  importTypeId;
  showApprovedBillModel = false;
  showApprovedBillSelectModel = false;
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
    suggestion: true,
    assignedTo:null,
    amendmentType : "SUGGESTION"
  };
  rbsPermission = {
    validation: false,
    apply: false,
    edit: false,
    submission: false,
    dissentnote: false,
    addDescription: false,
    markAsTaken: false,
    attachToFile: false,
    validateSuggestion:false,
    deleteSuggestion:false
  };
  mlaList = [];
  amendModalVisible = false;
  purpose = '';
  user;
  urlparams;
  meetingInfo;
  subagenda;
  showpreview = false;
  dissentNote = {
    showpopup: false,
    subagenda: null,
    businessId: null,
    purpose: null
  };
  attachToFile = {
    showpopup: false,
    subagenda: null,
    businessId: null,
    purpose: 'meetingReport'
  };
  dissentNoteAddedMembers = [];
  presentedMemberList = [];
  presentedMember: any = [];
  allmemberList =[];
  selectedBlockDetails: any = {
    parentBlock: [],
    currentBlock: [],
    type: '',
  };
  suggestionsTitle ="My Suggestions";
  memberResponse ;
  ministerReadingContent: any = null;
  showMinisterReadingPopup: any = false;

  constructor(
    private route: ActivatedRoute, private fb: FormBuilder,
    private committeeService: CommitteeService, private router: Router,
    @Inject('authService') private AuthService, public common: CommitteecommonService,
    private notify: NzNotificationService, public blockService: BlockSuggestService
  ) {
    this.user = AuthService.getCurrentUser();
    this.currentUser = AuthService.getCurrentUser();
    this.common.setCommitteePermissions(this.user.rbsPermissions);
    this.urlparams = this.router.getCurrentNavigation().extras.state;
    if (this.urlparams) {
      this.meetingInfo = this.urlparams.meetingInfo;
      this.subagenda = this.urlparams.subagenda;
      this.takenStatus = this.subagenda.forwardedBusiness.status;
    }
    this.purpose = this.route.snapshot.params.readonly;
    this.billId = this.route.snapshot.params.id;
    this.amendment.billId = this.billId;
    this.getBill(this.billId);
  }

  ngOnInit() {
    this.resetAmendment();
    this.getRbsPermissionsinList();
    // this.getReportDtoBySubagendaId();
    this.getMeetingMembersbySubagendaId();
    this.getAmendmentsOfBill(this.billId);
    this.getAllMlas();
    if (this.purpose === 'view') {
      this.isView = true;
    }
    this.createTableRowColumnForm();
  }
  showMarkPOPup(event) {
    this.markPopup = event;
  }
  confirmTaken() {
    if (this.takenStatus) {
      const body = {
        // id: this.subagenda.id,
        id: this.subagenda.forwardedBusiness.id,
        status: this.takenStatus
      };
      this.subagenda.forwardedBusiness.status = this.takenStatus;
      console.log(this.subagenda);
      this.committeeService.markBusiness(body).subscribe((res) => {
        this.notify.success('Success', 'Marked successfully');
        this.showMarkPOPup(false);
      });
    }
  }
  showReportPopup(event) {
    this.reportGen = event;
  }
  getMeetingMembersbySubagendaId(){
    this.presentedMember=[]
    this.committeeService
    .getCommiteeMembersBySubagendaId(this.subagenda.forwardedBusiness.id)
    .subscribe((Res:any) => {
      this.memberResponse = Res;
      console.log(this.memberResponse);
      if(this.meetingInfo.id && this.memberResponse.members){
        this.memberResponse.members.forEach(member => {
          if(member.attendence[this.meetingInfo.id] && member.attendence[this.meetingInfo.id].present == true){
            this.presentedMember.push(member);
          }
        });
      }
      const memArray: any = [];
      for (const check of this.presentedMember) {
        memArray.push(check.memberId);
      }
      this.presentedMemberList = this.allmemberList = memArray;
      console.log(this.presentedMemberList);
      this.getReportDtoBySubagendaId();
    });
  }
  getReportDtoBySubagendaId() {
    this.reportDto = null;
    this.committeeService.getReportDtoBySubagendaId(this.subagenda.forwardedBusiness.id).subscribe((res) => {
      this.reportDto = res;
      this.dissentNoteAddedMembers = [];
      if (this.reportDto.dissentNotes.length != 0) {
        this.reportDto.dissentNotes.forEach(element => {
          element.signedMembers.forEach(member => {
            this.dissentNoteAddedMembers.push(member);
          });
        });
      }
      this.reportDto.dissentNoteAddedMembers = this.dissentNoteAddedMembers;
    });
  }
  checkForAddDissentNote() {
    // this.isMeetingStarted();
    let canIadd = false;
    if(this.takenStatus !== 'COMPLETED'){
    canIadd = true;
    if (this.isCommiteeMember()) { 
      if (
        this.presentedMemberList.includes(this.user.userId) &&
        !this.dissentNoteAddedMembers.includes(this.user.userId) && 
        this.isMeetingStarted() && !this.isMeetingEnded()
      ) {
        canIadd = true;
      } else {
        canIadd = false;
      }
    }
  }
    return canIadd;
  }
  checkForAddSuggetsions(){
    let canIadd = false; 
    if(this.takenStatus !== 'COMPLETED'){
      // canIadd = true;
      // if(this.isCommiteeMember() && this.isMeetingEnded()){
      //   canIadd = false;
      // }else if(this.rbsPermission.validateSuggestion){
      //   canIadd = true;
      // }
      
      if(this.isCommiteeMember() || this.rbsPermission.validateSuggestion){
        canIadd = true;
        if(this.isCommiteeMember() && this.isMeetingEnded()){
          canIadd = false;
        }
      }
    }
    return canIadd;
  }
  isMeetingStarted(){
    let started = false;
    let today = new Date();
    const curdate = today.toISOString().split('T')[0];
    const meetigDate = new Date(this.meetingInfo.date).toISOString().split('T')[0];

    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    const curtime = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes());
    const meetingTime =  new Date(this.meetingInfo.time);
    const meetTime =this.addZero(meetingTime.getHours()) + ":" +this.addZero(meetingTime.getMinutes());
  
    if (meetigDate <= curdate) {
      if (getTime(curtime) >= getTime(meetTime)) {
        started = true;
        // console.log("Meeting time is started");
      }
    } 
    return started;
  }
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  isMeetingEnded(){
    let ended = false;
    if(this.meetingInfo.endTime){
    let today = new Date();
    const curdate = today.toISOString().split('T')[0];
    const meetigDate = new Date(this.meetingInfo.date).toISOString().split('T')[0];

    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    const curtime = this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes());
    const endingTime =  new Date(this.meetingInfo.endTime);
    const endTime =this.addZero(endingTime.getHours()) + ":" +this.addZero(endingTime.getMinutes());

    if (meetigDate <= curdate) {
      if (getTime(curtime) >= getTime(endTime)) {
        ended = true;
        // console.log("Meeting ended");
      }
    } 
  }
    return ended;
  }
  isCommiteeMember(){
    let committeeMember = false;
    const memberIds: any = [];
      for (const check of this.memberResponse.members) {
        memberIds.push(check.memberId);
      }
    if(memberIds.includes(this.user.userId)){
      committeeMember = true;
    }
    return committeeMember;
  }
  getRbsPermissionsinList() {
    if (this.common.doIHaveAnAccess('AMENDMENT_VALIDATION', 'READ')) {
      this.rbsPermission.validation = true;
    }
    if (this.common.doIHaveAnAccess('AMENDMENT_VALIDATION', 'READ')) {
      this.rbsPermission.apply = true;
    }
    if (this.common.doIHaveAnAccess('CLAUSE_BY_CLAUSE', 'SUBMIT')) {
      this.rbsPermission.submission = true;
    }
    if (this.common.doIHaveAnAccess('ADD_DISSENT_NOTE', 'CREATE')) {
      this.rbsPermission.dissentnote = true;
    }
    if (this.common.doIHaveAnAccess('ADD_REPORT_DESCRIPTION', 'CREATE')) {
      this.rbsPermission.addDescription = true;
    }
    if (this.common.doIHaveAnAccess('MARK_AS_TAKEN', 'CREATE')) {
      this.rbsPermission.markAsTaken = true;
    }
    if (this.common.doIHaveAnAccess('ATTACH_REPORT_TO_FILE', 'CREATE')) {
      this.rbsPermission.attachToFile = true;
    }
    if (this.common.doIHaveAnAccess('VALIDATE_SUGGESTIONS', 'UPDATE')) {
      this.rbsPermission.validateSuggestion = true;
      this.suggestionsTitle = "All Suggestions"
    }
    if (this.common.doIHaveAnAccess('DELETE_SUGGESTIONS', 'DELETE')) {
      this.rbsPermission.deleteSuggestion = true;
    }
  }

  getBill(billId) {
    this.common.getBillByBillId(billId).subscribe((res) => {
      this.billDetails = res;
      this.billDetails.blocks = this.billDetails.blocks.filter(
        (ele) => ele.content
      );
      this.disableActions = this.disableBill();
    });
  }
  getAmendmentsOfBill(billId) {
    if(this.isMLA()){
      this.common
      .getAmendmentsOfBillByMemberId(billId,this.user.userId)
      .subscribe((res: any) => {
        this.amendments = res;
        this.getAmendmentsCategory()
      });
    }else{
    this.common
      .getAmendmentsOfBillByMember(billId)
      .subscribe((res: any) => {
        this.amendments = res;
        this.getAmendmentsCategory();
      });
    }  
  }
  onSelectText(block) {
    if (block.status === 'INACTIVE' || !this.checkForAddSuggetsions()) {
      return;
    }
    if ((block.type.code === 'MEMORANDUM_REGARDING_DELEGATED_LEGISLATION')||
    (block.type.code === 'FINANCIAL_MEMORANDUM') ||
    (block.type.code === 'STATEMENT_OF_OBJECTS_AND_REASONS')
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
    const specialOperations = ['TABLE', 'SCHEDULE'];
    if (specialOperations.indexOf(code) > -1) {
      if (code === 'TABLE') {
        this.showRowColumnCountModel = true;
      }
    } else {
      this.selectedBlockDetails.parentBlock = parentBlock;
      this.selectedBlockDetails.currentBlock = currentBlock;
      this.selectedBlockDetails.type = type;
      this.amendment.operation = 'WHOLE_INSERT';
      this.amendment.blockIndex = Number(index) + 1;
      this.amendment.typeId = typeId;
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
    this.amendment.userId = this.currentUser.userId;
    (this.rbsPermission.validateSuggestion)? this.amendment.assignedTo = this.currentUser.userId : this.amendment.assignedTo = null;
    this.addBlocks(this.selectedBlockDetails, this.amendment.insertedWord);
    this.common
      .submitClauseByClauseAmendments(this.amendment)
      .subscribe((res) => {
        this.getAmendmentsOfBill(this.billId);
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
      this.common.submitAmendments(body).subscribe((data) => {
        this.notify.success('Success', 'Amendments submitted successfully');
        const userId = this.isPPO() ? this.primaryMemberId : this.currentUser.userId;
        this.getAmendmentsOfBill(this.billId);
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
      userId: this.user.userId,
      parentId: null,
      typeId: null,
      blockIndex: null,
      content: null,
      suggestion: true,
      assignedTo:null,
      amendmentType : 'SUGGESTION'
    };
  }

  backToList() {
    window.history.back();
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
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
    this.common
      .updateAmendmentStatus(this.billId, body)
      .subscribe((data) => {
        this.notify.success('Success', 'Status updated succesfully');
        const index = this.amendments.findIndex((x) => x.id === amendmentId);
        this.amendments[index].status = status;
      });
  }
  editAmendment(data) {
    // for (const obj of this.amendments) {
      for (const item of this.amendments) {
        item.edit = false;
      }
    // }
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
      suggestion: true,
      index: null,
      assignedTo : (this.rbsPermission.validateSuggestion) ?  this.currentUser.userId : null,
      amendmentType :'SUGGESTION'
    };
    this.amendment = body;
    this.saveAmendment();
  }
  deleteAmendments(noticeId) {
    this.common.deleteAmendments(noticeId).subscribe((data) => {
      this.getBill(this.billId);
      this.getAmendmentsOfBill(this.billId);
      this.notify.success('Success', 'Amendment deleted successfully');
    });
  }
  isEditable(item) {
    let editable = false;
    const editableItems = ['INSERTBEFORE', 'INSERTAFTER', 'REPLACE', 'RECAST'];
    if (editableItems.indexOf(item.operationType) > -1) {
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
      this.common
        .getMemberByPpo(this.currentUser.userId)
        .subscribe((data) => {
          this.mlaList = data as any;
        });
    } else {
      this.common.getAllExcludingMinisters().subscribe((data) => {
        this.mlaList = data as any;
      });
    }
  }
  showTitle(code) {
    const allowedTitles = ['MEMORANDUM_REGARDING_DELEGATED_LEGISLATION', 'FINANCIAL_MEMORANDUM', 'STATEMENT_OF_OBJECTS_AND_REASONS'];
    return allowedTitles.indexOf(code) > -1;
  }
  showDescriptionPopup(event) {
    this.reportGen = event;
    if (!event) {
      this.getReportDtoBySubagendaId();
    }
  }
  showReportPreview(event) {
    this.showpreview = event;
    this.getReportDtoBySubagendaId();
  }
  showDissentNote(purpose) {
    if(!this.meetingInfo.attendenceMarked && this.rbsPermission.validateSuggestion 
      && purpose == 'Add Dissent Note'){
      this.notify.warning(
        'Warning',
        'Please Mark Attendance of this meeting!'
      );
      return;
    }
    this.dissentNote.subagenda = this.subagenda;
    this.dissentNote.businessId = this.subagenda.businessId;
    this.dissentNote.showpopup = true;
    this.dissentNote.purpose = purpose;
  }
  cancelnote(event) {
    this.dissentNote.showpopup = event;
    this.getReportDtoBySubagendaId();
  }
  showFileCreate(event) {
    this.attachToFile.showpopup = true;
  }
  onCancelFileCreate($event) {
    this.attachToFile.showpopup = false;
  }
  getContent(block) {
    const elementType = block.type.code;
    if (elementType === 'TABLE' || elementType === 'SCHEDULE') {
      return this.blockService.jsonToHtmlTable(block);
    } else {
      return block.content;
    }
  }
  createTableRowColumnForm() {
    this.validateForm = this.fb.group({
      numberOfRows: [1],
      numberOfColumns: [1]
    });
  }
  // function to prevent keyboard
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
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
            id: c + 1, content: '', colSpan: 1, rowSpan: 1, cellIndex: c
          });
        }
        newRow.push({ columns });
      }
    }
  }
  continueAndSelectSection() {
    const selectdAct = this.approvedBillList.find(
      (element) => element.checked === true
    );
    if (selectdAct) {
      this.common
        .getBillByBillId(selectdAct.billId)
        .subscribe((res: any) => {
          this.approvedBillContent = res.blocks;
          this.approvedBillContent.map((element) => {
            element.defaultParentId = this.selectedBlockDetails.parentBlock.id;
            element.checked = false;
            element.upcommingIndex = this.selectedBlockIndex;
            element.defaultBillId = this.billDetails.id;
            element.upcommingTypeId = this.importTypeId;
            element.userId = this.isPPO()
              ? this.primaryMemberId
              : this.currentUser.userId;
          });
          this.showApprovedBillModel = false;
          this.showApprovedBillSelectModel = true;
        });
      this.getAmendmentsOfBill(this.billId);
    } else {
      this.notify.info('Info', 'Please select one act ...');
    }
  }
  uncheckOtherCheckBox(checkedBillId) {
    this.approvedBillList.map((element) => {
      if (element.billId !== checkedBillId) {
        element.checked = false;
      }
    });
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
  importOrCancel(event) {
    this.getBill(this.billId);
    this.showApprovedBillSelectModel = false;
  }
  //  open approved bill list
  getApprovedBillList(currentBlockIndex, typeId) {
    this.common.getApprovedBillList().subscribe((res: any) => {
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
  // get all approved bill content details by subsection click
  getApprovedBillContentByBlockId(parentBlock, currentBlock, typeId) {
    this.common.getSubBlockByBlockId(parentBlock.id).subscribe((res) => {
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

  // set the block to outer block
  setSuperParentBlock(parentBlock, type, content) {
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = null;
    this.amendment.billId = Number(this.billId);;
    this.amendment.blockIndex = parentBlock.index + 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  // set the block to the same level of current block
  setSameLevelOfBlock(parentBlock, currentBlock, type, content) {
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = parentBlock.id;
    this.amendment.billId = Number(this.billId);
    this.amendment.blockIndex = currentBlock.index + 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  // set the block to the child of current block
  setChilOfBlock(parentBlock, currentBlock, type, content) {
    
    this.amendment.id = null;
    this.amendment.content = content;
    this.amendment.parentId = currentBlock.id;
    this.amendment.billId = Number(this.billId);;
    this.amendment.blockIndex = 1;
    this.amendment.typeId = type.id;
    this.amendment.insertedWord = content;
  }
  checkForUnactedSuggestions() {
    const inactedSuggestionCheck = this.amendments.find(x => x.status === 'SAVED');
    if (inactedSuggestionCheck) {
      return true;
    }
    return false;
  }

  showMinisterReading() {
    this.showMinisterReadingPopup = !this.showMinisterReadingPopup;
  }
  getAmendmentsCategory(){
    this.amendmentGroup = [];
    let groups = [];
    groups = this.amendments.map((x) => ({
      blockTypeCode: x.blockTypeCode,
    }));
    this.amendmentGroup = groups.reduce((unique, o) => {
      if(!unique.some(obj => obj.blockTypeCode === o.blockTypeCode)) {
        unique.push(o);
      }
      return unique;
     },[]);
  }
}
