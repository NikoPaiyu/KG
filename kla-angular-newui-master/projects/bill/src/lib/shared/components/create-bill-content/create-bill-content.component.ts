import {
  Component,
  OnInit,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { createBillModel } from './create-bill-content-model';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { BillManagementService } from '../../services/bill-management.service';
import { type } from 'os';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CreateBillContentSelectComponent } from '../create-bill-content-select/create-bill-content-select.component';
@Component({
  selector: 'lib-create-bill-content',
  templateUrl: './create-bill-content.component.html',
  styleUrls: ['./create-bill-content.component.css'],
})
export class CreateBillContentComponent implements OnInit {
  // current block
  @Input() billDetails: any = [];
  // out put will emit after block create
  @Output() blockCreated = new EventEmitter<boolean>();
  fullScreenMode = false;
  billLanguage: any[] = createBillModel.languageList;
  textareaValueChange = false;
  approvedBillList: any;
  tempApprovedBillList: any;
  showApprovedBillModel = false;
  showApprovedBillSelectModel = false;
  approvedBillContent: any = [];
  selectedBlockIndex: any = {};
  importTypeId: number;
  validateForm: FormGroup;
  showRowColumnCountModel = false;
  selectedBlockEntireDetails: any = [];
  isResponseCame = true;
  oldReferenceActs = [];
  oldReferenceEntry = false;
  @ViewChildren("row") rows;
  @ViewChild(CreateBillContentSelectComponent, {static: false})
  billContentSelect: CreateBillContentSelectComponent;
  constructor(
    private elRef: ElementRef,
    private notification: NzNotificationService,
    private billService: BillManagementService,
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createTableRowColumnForm();
    console.log('params', this.route.snapshot.params.id);
    // setTimeout(() => {
    //   window.scrollTo(0, document.body.scrollHeight);
    // }, 4000);
    // this.resizeAllTextBox();
    
  }

  transformOldreferences() {
    if (this.billDetails.oldReferenceAct && this.billDetails.oldReferenceAct.length > 0) {
      this.oldReferenceActs = this.billDetails.oldReferenceAct.map(x => ({title: x, checked: false}));
    }
  }

  // fullscreen mode
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  // show hide hover Add block button
  showAddBlockButtons(blockType) {
    if (createBillModel.addButtonsNotRequiredBlocks.includes(blockType)) {
      return false;
    }
    return true;
  }
  // show hide hove remove button
  showRemoveBlockButtons(blockType) {
    if (createBillModel.removeButtonsNotRequiredBlocks.includes(blockType)) {
      return false;
    }
    return true;
  }
  // check whether block needs header
  isHeaderRequiredBlock(typeCode): boolean {
    if (
      createBillModel.headerRequiredBlock.includes(typeCode)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // check whether block needs to show typename
  isTypeNameNotRequiredBlock(typeCode): boolean {
    if (
      createBillModel.typeNameNotRequiredBlock.includes(typeCode)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // check the block is readonly or not
  isTextAreaReadOnly(typeCode): boolean {
    if (createBillModel.textAreaDisabledBlock.includes(typeCode)) {
      return true;
    } else {
      return false;
    }
  }

  // check the block required custom table
  isTableRequiredBlock(typeCode): boolean {
    if (createBillModel.tableRequiredBlock.includes(typeCode)) {
      return true;
    } else {
      return false;
    }
  }

  // list buttblockCreatedon when hover
  listOfHoverButton(event) {
    switch (event) {
      case 'ENACTING_FORMULA': {
        return createBillModel.enactingFormula;
      }
      case 'MARGINAL_HEADING': {
        let marginalHeadingType = createBillModel.marginalHeading
        if (this.billDetails.type != "AMENDING_BILL") {
          marginalHeadingType = marginalHeadingType.filter(f => f.code != "SECTION")
        }
        return marginalHeadingType;
      }
      case 'SECTION': {
        return createBillModel.section;
      }
      case 'CHAPTER': {
        return createBillModel.chapter;
      }
      case 'SUB_SECTION': {
        return createBillModel.subSection;
      }
      case 'CLAUSE': {
        let clauseType = createBillModel.clause
        if (this.billDetails.type != "AMENDING_BILL") {
          clauseType = clauseType.filter(f => f.code != "SECTION")
        }
        return clauseType;
      }
      case 'SUB_CLAUSE': {
        return createBillModel.subClause;
      }
      case 'ITEM': {
        return createBillModel.item;
      }
      case 'SUB_ITEM': {
        return createBillModel.subItem;
      }
      case 'PROVISO': {
        return createBillModel.proviso;
      }
      case 'EXPLANATION': {
        return createBillModel.explanation;
      }
      case 'NOTE': {
        return createBillModel.note;
      }
      case 'EXTRACT': {
        return createBillModel.extract;
      }
    }
  }

  // mouse hover button click
  // addBlocks(parentBlock, currentBlock, type) {
  //   this.textareaValueChange = true;
  //   this.selectedBlockEntireDetails.parentBlock = parentBlock;
  //   this.selectedBlockEntireDetails.currentBlock = currentBlock;
  //   this.selectedBlockEntireDetails.type = type;
  //   switch (type.code) {
  //     case 'SECTION': {
  //       const index = currentBlock.type.code == "CLAUSE" || currentBlock.type.code == "MARGINAL_HEADING" ? 1 : currentBlock.index + 1;
  //       this.getApprovedBillList(index, 8, 'SECTION');
  //       break;
  //     }
  //     case 'SUB_SECTION': {
  //       if (currentBlock.type.code == 'SECTION') {
  //         this.getApprovedBillContentByBlockId(parentBlock, currentBlock, 10);
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'CLAUSE': {
  //       this.setSuperParentBlock(parentBlock, type, '');
  //       break;
  //     }
  //     case 'SUB_CLAUSE': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'MARGINAL_HEADING'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'ITEM': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'SUB_ITEM': {
  //       if (currentBlock.type.code == 'ITEM') {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'PROVISO': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'EXPLANATION': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'NOTE': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'PARAGRAPH': {
  //       if (currentBlock.type.code == 'PARAGRAPH') {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'CHAPTER': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'SCHEDULE': {
  //       this.showRowColumnCountModel = true;
  //       break;
  //     }
  //     case 'TABLE': {
  //       this.showRowColumnCountModel = true;
  //       break;
  //     }
  //     case 'DETAILS': {
  //       if (
  //         currentBlock.type.code == 'CLAUSE' ||
  //         currentBlock.type.code == 'SUB_CLAUSE'
  //       ) {
  //         this.setChilOfBlock(parentBlock, currentBlock, type, '');
  //       } else {
  //         this.setSameLevelOfBlock(parentBlock, currentBlock, type, '');
  //       }
  //       break;
  //     }
  //     case 'SUB_EXTRACT': {
  //       this.getApprovedBillContentByBlockId(parentBlock, currentBlock, 26);
  //       break;
  //     }
  //   }
  // }

  addBlocks(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex, type) {
    const parentBlock = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex == 1 ? 1 : heirarchyIndex - 1);
    const currentBlock = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex);
    this.textareaValueChange = true;
    this.selectedBlockEntireDetails.parentBlock = parentBlock;
    this.selectedBlockEntireDetails.currentBlock = currentBlock;
    this.selectedBlockEntireDetails.type = type;
    switch (type.code) {
      case 'SECTION': {
        const index = currentBlock.type.code == "CLAUSE" || currentBlock.type.code == "MARGINAL_HEADING" ? 1 : currentBlock.index + 1;
        this.getApprovedBillList(index, 8, 'SECTION');
        break;
      }
      case 'SUB_SECTION': {
        this.getApprovedBillContentByBlockId(parentBlock, currentBlock, 10);
        break;
      }
      case 'CLAUSE': {
        this.setSuperParentBlock(firstLevelObj, type, '');
        break;
      }
      case 'SUB_CLAUSE': {
        if (heirarchyIndex == 1) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        }
        else if (heirarchyIndex == 2) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        else if (heirarchyIndex > 2) {
          this.setSameLevelOfBlock(firstLevelObj, seconfLevelObj, type, '');
        }
        break;
      }
      case 'ITEM': {
        if (
          currentBlock.type.code == 'CLAUSE' ||
          currentBlock.type.code == 'SUB_CLAUSE' || currentBlock.type.code == "MARGINAL_HEADING"
        ) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'SUB_ITEM': {
        if (currentBlock.type.code == 'ITEM') {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'PROVISO': {
        if (
          currentBlock.type.code == 'CLAUSE' ||
          currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'EXPLANATION': {
        if (
          currentBlock.type.code == 'CLAUSE' ||
          currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'NOTE': {
        if (
          currentBlock.type.code == 'CLAUSE' ||
          currentBlock.type.code == 'SUB_CLAUSE'
        ) {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setChilOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'PARAGRAPH': {
        if (currentBlock.type.code == 'PARAGRAPH') {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
          this.setSameLevelOfBlock(block, currentBlock, type, '');
        } else {
          const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex - 1)
          this.setChilOfBlock(block, currentBlock, type, '');
        }
        break;
      }
      case 'CHAPTER': {
        this.setSuperParentBlock(firstLevelObj, type, '');
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
        const block = this.getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex)
        this.setChilOfBlock(block, currentBlock, type, '');
        break;
      }
      case 'SUB_EXTRACT': {
        this.getApprovedBillContentByBlockId(parentBlock, currentBlock, 26);
        break;
      }
    }
  }

  getHeirarchyLevelBlock(firstLevelObj, seconfLevelObj, thirdLevelObj, fourthLevelObj, fifthLevelObj, heirarchyIndex) {
    if (heirarchyIndex == 1) {
      return firstLevelObj
    }
    else if (heirarchyIndex == 2) {
      return seconfLevelObj
    }
    else if (heirarchyIndex == 3) {
      return thirdLevelObj
    }
    else if (heirarchyIndex == 4) {
      return fourthLevelObj
    }
    else if (heirarchyIndex == 4) {
      return fifthLevelObj
    }
  }

  // set the block to outer block
  setSuperParentBlock(parentBlock, type, content) {
    const newBlock = {
      id: null,
      content,
      parentId: null,
      billId: parentBlock.billId,
      index: type.code == "DETAILS" ? 0 : parentBlock.index + 1,
      indexValue: '',
      subBlockDto: [],
      type: {
        createdDate: '',
        updatedDate: '',
        id: type.id,
        code: type.code,
        name: type.title,
        fontSize: '',
        endCharacter: '',
        indexType: '',
        level: null,
        template: '',
        bold: false,
        italic: false,
        underline: false,
      }
    };


    const currentIndex = this.billDetails.blocks.findIndex(
      (x) => x.id === parentBlock.id
    );
    this.billDetails.blocks.splice(currentIndex + 1, 0, newBlock);
  }

  // set the block to the child of current block
  setChilOfBlock(parentBlock, currentBlock, type, content) {
    const newBlock = {
      id: null,
      content,
      parentId: currentBlock.id,
      billId: parentBlock.billId,
      index: type.code == "DETAILS" ? 0 : 1,
      indexValue: '',
      subBlockDto: [],
      type: {
        createdDate: '',
        updatedDate: '',
        id: type.id,
        code: type.code,
        name: type.title,
        fontSize: '',
        endCharacter: '',
        indexType: '',
        level: null,
        template: '',
        bold: false,
        italic: false,
        underline: false,
      }
    };
    const currentIndex = parentBlock.subBlockDto.findIndex(
      (x) => x.id === currentBlock.id
    );
    if (this.checkDetailTypeInclude(parentBlock)) {
      currentBlock.subBlockDto.splice(1, 0, newBlock);
    }
    else {
      currentBlock.subBlockDto.splice(0, 0, newBlock);
    }

  }

  // set the block to the same level of current block
  setSameLevelOfBlock(parentBlock, currentBlock, type, content) {
    const newBlock = {
      id: null,
      content,
      parentId: parentBlock.id,
      billId: parentBlock.billId,
      index: type.code == "DETAILS" ? 0 : currentBlock.index + 1,
      indexValue: '',
      subBlockDto: [],
      type: {
        createdDate: '',
        updatedDate: '',
        id: type.id,
        code: type.code,
        name: type.title,
        fontSize: '',
        endCharacter: '',
        indexType: '',
        level: null,
        template: '',
        bold: false,
        italic: false,
        underline: false,
      }
    };

    const currentIndex = parentBlock.subBlockDto.findIndex(
      (x) => x.id === currentBlock.id
    );
    parentBlock.subBlockDto.splice(currentIndex + 1, 0, newBlock);

  }

  checkDetailTypeInclude(block) {
    const findDetails = block.subBlockDto.find(d => d.type.code == "DETAILS")
    if (findDetails) {
      return true
    }
    else {
      return false
    }
  }
  // store clicked block content into a varable
  blockValueChange() {
    this.textareaValueChange = true;
  }
  // save current block
  textAreaFocusOut(currentBlock) {
    if (this.textareaValueChange) {
      if (!currentBlock.content) {
        const isValidationRequiredBlock = !createBillModel.contentOptionalBlock.includes(
          currentBlock.type.code
        );
        if (isValidationRequiredBlock) {
          this.notification.warning('Warning!', 'Input cannot be empty');
          return false;
        }
      }
      this.saveBlock(currentBlock);
    }
    this.textareaValueChange = false;
  }

  // function for save block
  saveBlock(block) {
    let content;

    if (this.isResponseCame) {
      this.isResponseCame = false;
      if (this.isTableRequiredBlock(block.type.code)) {
        content = JSON.stringify(block.content);
      } else {
        content = block.content;
      }

      const body = {
        billId: this.billDetails.id,
        content,
        id: block.id ? block.id : null,
        index: block.index,
        parentId: block.parentId,
        typeId: block.type.id,
      };
      // if (body.id) {
      //   this.billService.updateBillBlocks(body).subscribe((res) => {
      //     this.isResponseCame = true;
      //     this.message.create('success', 'Auto updated successfully');
      //     this.blockCreated.emit(true);
      //   });
      // } else {
      this.billService.createBillBlocks(body).subscribe((res) => {
        this.isResponseCame = true;
        this.message.create('success', 'Auto saved successfully');
        this.blockCreated.emit(true);
      });
      //}
    }

  }

  // remove block
  removeBlock(parentBlock, currentBlock, currentBlockndex, heirarchyIndex) {
    if (currentBlock.id) {
      this.billService.removeBlock(currentBlock.id).subscribe((res) => {
        this.notification.success('Delete', 'Block deleted succesfully');
        this.blockCreated.emit(true);
      });
    } else {
      if (heirarchyIndex == 1) {
        this.billDetails.blocks.splice(currentBlockndex, 1);
      }
      else {
        // block remove from child block
        parentBlock.subBlockDto.splice(currentBlockndex, 1);
      }
    }
  }

  //  open approved bill list
  getApprovedBillList(currentBlockIndex, typeId, typeCode) {
    this.billService.getApprovedBillListByBillId(this.billDetails.id).subscribe((res: any) => {
      this.selectedBlockIndex = currentBlockIndex;
      this.importTypeId = typeId;
      this.showApprovedBillModel = true;
      res.map((obj) => {
        obj.checked = false;
        obj.typeCode = typeCode;
      });
      this.approvedBillList = res;
      this.tempApprovedBillList = res;
      this.transformOldreferences();
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

  // uncheck other check box in approved bill model table
  uncheckOtherCheckBox(checkedBillId, type) {
    if (type == 'new') {
      this.approvedBillList.map((element) => {
        if (element.billId != checkedBillId) {
          element.checked = false;
        }
      });
    } else {
      this.oldReferenceActs.map((element) => {
        if (element.title != checkedBillId) {
          element.checked = false;
        }
      });
    }    
  }

  // continue and select section in approved bill
  continueAndSelectSection(actType) {
    if (actType == 'new') {
      const selectdAct = this.approvedBillList.find(
        (element) => element.checked == true
      );
      if (selectdAct) {
        this.billService
          .getBillByBillId(selectdAct.billId)
          .subscribe((res: any) => {
            this.approvedBillContent = res.blocks;
            this.approvedBillContent.map((element) => {
              element.defaultParentId = selectdAct.typeCode === "SECTION" ? this.selectedBlockEntireDetails.parentBlock.id : null;
              element.checked = false;
              element.upcommingIndex = this.selectedBlockIndex;
              element.defaultBillId = this.billDetails.id;
              element.upcommingTypeId = this.importTypeId;
            });
            this.billContentSelect.oldActEntry = false;
            this.showApprovedBillModel = false;
            this.showApprovedBillSelectModel = true;
          });
      } else {
        this.notification.info('Info', 'Please select one act ...');
      }
    } else {
      const selectdAct = this.oldReferenceActs.find(
        (element) => element.checked == true
      );
      if (selectdAct) {
        this.showApprovedBillModel = false;
        this.showApprovedBillSelectModel = true;
        this.oldReferenceEntry = true;
        this.billContentSelect.oldActEntry = true;
        this.billContentSelect.initForm();
        this.billContentSelect.ActForm.get('billId').setValue(this.billDetails.id);
        this.billContentSelect.ActForm.get('typeId').setValue(this.importTypeId);
        this.billContentSelect.ActForm.get('index').setValue(this.selectedBlockIndex);
        const act = this.oldReferenceActs.find(x => x.checked);
        if (act) {
          this.billContentSelect.ActForm.get('referenceBillNumber').setValue(act.title);
        }
        if (this.importTypeId == 8) {
          this.billContentSelect.ActForm.get('parentId').setValue(this.selectedBlockEntireDetails.parentBlock.id);
        } else if (this.importTypeId == 10) {
          this.billContentSelect.ActForm.get('parentId').setValue(this.selectedBlockEntireDetails.currentBlock.id);
        }
        
      } else {
        this.notification.info('Info', 'Please select one act ...');
      }
    }
    
  }

  // get all approved bill content details by subsection click
  getApprovedBillContentByBlockId(parentBlock, currentBlock, typeId) {
    this.billService.getSubBlockByBlockId(parentBlock.id).subscribe((res) => {
      this.approvedBillContent = res;
      this.approvedBillContent.map((element) => {
        element.defaultParentId = currentBlock.id;
        element.checked = false;
        element.upcommingIndex = currentBlock.type.code == "SECTION" ? 1 : currentBlock.index + 1;
        element.defaultBillId = this.billDetails.id;
        element.upcommingTypeId = typeId;
      });
      this.selectedBlockIndex = currentBlock.type.code == "SECTION" ? 1 : currentBlock.index + 1;
      this.showApprovedBillModel = false;
      this.showApprovedBillSelectModel = true;
      if(this.approvedBillContent && this.approvedBillContent.length < 1) {
        this.billContentSelect.oldActEntry = true;
        this.billContentSelect.ActForm.get('billId').setValue(this.billDetails.id);
        this.billContentSelect.ActForm.get('typeId').setValue(typeId);
        this.billContentSelect.ActForm.get('parentId').setValue(currentBlock.id);
        this.billContentSelect.ActForm.get('index').setValue(this.selectedBlockIndex);
      }
    });
  }
  // function will trigger when the import or cancel button click from component
  importOrCancel(event) {
    this.blockCreated.emit(event);
    this.showApprovedBillSelectModel = false;
  }

  // function to prevent keyboard
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
  }

  // funtion for create rows and column for
  createTableRowColumnForm() {
    this.validateForm = this.formBuilder.group({
      numberOfRows: [1],
      numberOfColumns: [1]
    });
  }

  // create table
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
          })
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

  mergeColumn(selectedRow, selectedColumn, cellIndex) {
    const nextCell = selectedRow.columns[cellIndex + 1];
    if (nextCell && nextCell.rowSpan == selectedColumn.rowSpan) {
      if (nextCell.colSpan > 1 && selectedColumn.colSpan > 1) {
        selectedColumn.colSpan = selectedColumn.colSpan + nextCell.colSpan;
      } else if (nextCell.colSpan > 1 && selectedColumn.colSpan == 1) {
        selectedColumn.colSpan = nextCell.colSpan + 1;
      } else {
        selectedColumn.colSpan = selectedColumn.colSpan + 1;
      }
      selectedRow.columns.splice(cellIndex + 1, 1);
    } else {
      this.notification.info('Info', 'Can\'t merge this cell...');
    }
  }

  mergeRow(table, selectedColumn, rowIndex, cellIndex) {
    const nextRow = table[rowIndex + selectedColumn.rowSpan];
    if (nextRow) {
      const nextRemoveCell = nextRow.columns.find(f => f.cellIndex == selectedColumn.cellIndex)
      const removeCellIndex = nextRow.columns.findIndex(el => el.cellIndex == selectedColumn.cellIndex)
      if (nextRemoveCell && nextRemoveCell.colSpan == selectedColumn.colSpan) {
        if (nextRemoveCell.rowSpan > 1 && selectedColumn.rowSpan > 1) {
          selectedColumn.rowSpan = selectedColumn.rowSpan + nextRemoveCell.rowSpan;
        } else if (nextRemoveCell.rowSpan > 1 && selectedColumn.rowSpan == 1) {
          selectedColumn.rowSpan = nextRemoveCell.rowSpan + 1;
        } else {
          selectedColumn.rowSpan = selectedColumn.rowSpan + 1;
        }
        nextRow.columns.splice(removeCellIndex, 1);
      }
      else {
        this.notification.info("Info", "Can't merge this cell...");
      }
    }
  }

  addColumn(table, selectedColumn, side) {
    const columnIndex = side == "Left" ? selectedColumn.cellIndex : selectedColumn.cellIndex + 1;
    table.forEach((el, index) => {
      this.addExtraColumn(el, columnIndex)
      this.resetColCellIndex(el)
    });

  }

  addExtraColumn(row, columnIndex) {
    row.columns.splice(columnIndex, 0, {
      id: 0, content: "", colSpan: 1, rowSpan: 1, cellIndex: 0
    })
  }
  resetColCellIndex(row) {
    row.columns.forEach((elsec, secIndex) => {
      elsec.id = secIndex + 1;
      elsec.cellIndex = secIndex;
    });
  }

  addRow(table, rowIndex, side) {
    const indexRow = side == 'Down' ? rowIndex + 1 : rowIndex;
    const numberOfColumns = this.findTotalColInRow(table[rowIndex].columns)
    this.addExtraRow(table, indexRow, numberOfColumns)
  }
  addExtraRow(table, rowIndex, numberOfColums) {
    let colums = [];
    for (let i = 0; i < numberOfColums; i++) {
      colums.push({
        id: i + 1, content: "", colSpan: 1, rowSpan: 1, cellIndex: i
      })
    }
    table.splice(rowIndex, 0, { columns: colums });
  }

  findTotalColInRow(row) {
    let totalColum = 0;
    row.forEach(el => {
      totalColum = totalColum + el.colSpan;
    });
    return totalColum;
  }

  //retu blocktype and its index value
  returnBlockTypeAndIndexValue(blockDetails) {
    let returnValue = '';
    if (blockDetails.type.code == 'SUB_CLAUSE') {
      if (blockDetails.indexValue) {
        returnValue = `Clause ${blockDetails.indexValue}`;
      }
      else {
        returnValue = `Sub Clause`;
      }
      return returnValue
    }
    // else if (blockDetails.type.code == 'DETAILS') {
    //   returnValue = `Details(${blockDetails.type.title + blockDetails.indexValue})`
    // }
    else {
      returnValue = `${blockDetails.type.name} ${blockDetails.indexValue}`;
      return returnValue
    }
  }
  // resise all check box
  resizeAllTextBox() {
    let vtextarea = this.elRef.nativeElement.querySelectorAll('textarea');
    for (let i = 0; i < vtextarea.length; i++) {
      vtextarea[i].style.height = '0px';
      vtextarea[i].style.height = vtextarea[i].scrollHeight + 25 + 'px';
    }
  }

  // resize on key up
  autoGrowTextZone(e) {
    e.target.style.height = '0px';
    e.target.style.height = e.target.scrollHeight + 25 + 'px';
  }

  ngAfterViewInit() {
    console.log('view init');
    const billId = this.route.snapshot.params.id;
    if (billId) {
      setTimeout(() => {
        this.rows.last.nativeElement.focus();
      }, 300);
    }
  }
  hideActPopup() {
    this.showApprovedBillModel = false;
    this.oldReferenceActs = this.oldReferenceActs.map( x => ({title: x.title}));
  }
}
