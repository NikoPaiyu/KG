import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';
import { createResolutionModel, types } from './create-resolution-content-model';

@Component({
  selector: 'pmbr-create-resolution-content',
  templateUrl: './create-resolution-content.component.html',
  styleUrls: ['./create-resolution-content.component.css']
})
export class CreateResolutionContentComponent implements OnInit {

  // current block
  @Input() resolutionDetails: any = [];
  // out put will emit after block create
  @Output() blockCreated = new EventEmitter<boolean>();
  fullScreenMode = false;
  billLanguage: any[] = createResolutionModel.languageList;
  textareaValueChange = false;
  isResponseCame = true;
  typeList = types;
  @ViewChildren("row") rows;
  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private resolutionService: PmbrResolutionService, private message: NzMessageService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 4000);
    // this.resizeAllTextBox();
  }

  ngAfterViewInit() {
    const billId = this.route.snapshot.params.id;
    if (billId) {
      setTimeout(() => {
        this.rows.last.nativeElement.focus();
      }, 300);
    }
  }

  // fullscreen mode
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }


  addBlocks(index, typeId) {
    const newBlock = this.resolutionService.getNewResolutionBlock(index + 1, typeId, this.resolutionDetails.id);
    this.resolutionDetails.blocks.splice(index + 1, 0, newBlock);
  }

  // store clicked block content into a varable
  blockValueChange() {
    this.textareaValueChange = true;
  }
  // save current block
  textAreaFocusOut(currentBlock) {
    if (this.textareaValueChange) {
      this.saveBlock(currentBlock);
    }
    this.textareaValueChange = false;
  }

  // function for save block
  saveBlock(block) {
    if (this.isResponseCame) {
      this.isResponseCame = false;
      const body = {
        billId: this.resolutionDetails.id,
        content: block.content,
        id: block.id ? block.id : null,
        index: block.index,
        parentId: block.parentId,
        typeId: block.type.id,
      };
      this.resolutionService.createResolutionBlock(body).subscribe((res) => {
        this.isResponseCame = true;
        this.message.create('success', 'Auto saved successfully');
        this.blockCreated.emit(true);
      });
    }

  }

  // remove block
  removeBlock(currentBlock, index) {
    if (currentBlock.id) {
      this.deleteResolutionBlockById(currentBlock.id);
      this.blockCreated.emit(true);
    }
    else {
      this.resolutionDetails.blocks.splice(index, 1)
    }
  }

  deleteResolutionBlockById(blockId) {
    this.resolutionService.deleteResolutionBlockById(blockId).subscribe(res => {
      this.message.create('success', 'Block deleted successfully');
    })
  }


  // function to prevent keyboard
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
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



}
