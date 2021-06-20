import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ChatDetails } from '../shared/model/chatDetails';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ChatSocketService } from '../shared/services/chat-socket.service';
import { Message } from '../shared/model/message';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { subscribeToPromise } from 'rxjs/internal-compatibility';
import { SpeakerRBSService } from '../shared/services/speaker-rbs.service';
import { NzSelectUnselectableDirective } from 'ng-zorro-antd';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-speaker-chat',
  templateUrl: './speaker-chat.component.html',
  styleUrls: ['./speaker-chat.component.scss']
})
export class SpeakerChatComponent implements OnInit, OnDestroy {
  images: string;
  transformed: any;
  imageUrl: any;
  isImageVisible: boolean;
  newimageUrl: any;
  imageForPreview: any;
  chatTemplates = [];
  isVisible = false;
  templateVisible: boolean;
  public listFlag: boolean = false;
  sub: Subscription;
  searchText = '';
  user: ChatDetails;
  users: ChatDetails[] = [];
  activeUser: any = {};
  public userId = '';
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  public isImp: boolean = false;
  public form: FormGroup;
  public userForm: FormGroup;
  messages: Message[] = [];
  chats = [];
  chatFromSocket = null;
  currentUserChats = [];
  message: string;
  members;
  membersCopy;
  IsSpeaker;
  IsnewactiveSpeaker;
  IsSec;
  mla;
  base64Image: any;
  isImg: boolean = false;
  image: string;
  visible = true;

  constructor(
    private chatService: ChatService,
    private socketService: ChatSocketService,
    private authService: AuthService,
    private notify: NotificationCustomService,
    private rbsSerive: SpeakerRBSService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
  ) {
    this.userId = this.authService.getCurrentUser().userId;
    this.subscribeToMessages();
  }
  subscribeToMessages() {
    this.sub = this.socketService.messageForChatScreen.subscribe(messages => {
      this.chatFromSocket = messages;
      if (this.chatFromSocket && this.chatFromSocket.id) {
        if (this.activeUser) {
          if (
            this.activeUser.userId == this.chatFromSocket.sendBy ||
            this.activeUser.userId == this.chatFromSocket.sendTo
          ) {
            this.currentUserChats.push(this.chatFromSocket);
            this.filterUnreadAndMarkAsRead();
          }
        }
        this.increasePendingMessageCountOfParticularUser(this.chatFromSocket);
        this.moveNewChatUserToFirst(this.chatFromSocket);
      }
    });
  }
  moveNewChatUserToFirst(chatFromSocket) {
    if (this.members) {
      this.members.forEach((category, index) => {
        let userIndex = category.values.findIndex(
          element => element.userId == chatFromSocket.sendBy
        );
        if (userIndex >= 0) {
          let user = this.members[index].values.splice(userIndex, 1);
          let userNewCategoryIndex = this.members.findIndex(
            element => element.memberType == user[0].memberType
          );
          if (userNewCategoryIndex >= 0) {
            this.members[userNewCategoryIndex].values.splice(0, 0, user[0]);
          }
        }
      });
      this.members.forEach(element => {
        element.values = element.values.filter(item => item);
      });
    }
  }
  increasePendingMessageCountOfParticularUser(chatFromSocket) {
    if (this.members) {
      this.members.forEach((category, index) => {
        let userIndex = category.values.findIndex(
          element => element.userId == chatFromSocket.sendBy
        );
        if (userIndex >= 0) {
          this.members[index].values[userIndex].pendingMessages += 1;
          if (chatFromSocket.important)
            this.members[index].values[userIndex].importantMessages += 1;
        }
      });
    }
    this.members
      ? this.members.forEach(element => {
        element.values = element.values.filter(item => item);
      })
      : '';
  }
  ngOnInit() {
    this.speakerOrNot();
    this.secretaryOrNot();
    this.form = new FormGroup({
      message: new FormControl(null)
    });
    this.userForm = new FormGroup({
      fromId: new FormControl(null, [Validators.required]),
      toId: new FormControl(null)
    });

    this.user = new ChatDetails();
    this.onChat();
  }

  searchChatMembers(searchText) {
    let filteredCharacters = this.members.filter(element =>
      element.fullName.toLowerCase().includes(searchText.toLowerCase())
    );
    this.members = filteredCharacters;
  }

  isImportant() {
    this.isImp = !this.isImp;
  }
  sendMessageUsingSocket(f: NgForm, userName, isImp) {
    if (f.value.message.trim()) {
      let chat = {
        sendBy: this.userId,
        sendTo: this.activeUser.userId,
        message: f.value.message,
        important: isImp
      };
      this.chatService.postMessage(chat).subscribe(response => {
        // this.getParticularUserChatList(this.activeUser.member.userId);
      });
      this.clearMessageInput();
      this.isImp = false;
      this.isImg = false;
      this.image = '';
    }
  }
  clearMessageInput() {
    this.message = '';
  }

  currentUserChatItems() {
    this.currentUserChats = this.chats.filter(
      chat =>
        chat.sendBy == this.activeUser.userId ||
        chat.sendTo == this.activeUser.userId
    );
  }
  onClickchatList(user, userType) {
    this.activeUser = user;
    this.listFlag = true;
    this.getChatTemplates(userType);
    this.getParticularUserChatList(user.userId);
  }
  onClickNavigation() {
    this.listFlag = false;
    this.activeUser = {};
    this.onChat();
  }
  getParticularUserChatList(userId) {
    this.chats = [];
    this.currentUserChats = [];
    this.chatService
      .getParticularUserChatList(userId, this.userId)
      .subscribe((res: []) => {
        this.chats = res;
        this.chats.forEach(element => {
          if (element.isImg == true) {
            this.newimageUrl = element.image;
            this.transform(this.newimageUrl);
          }
        });
        this.currentUserChatItems();
        this.filterUnreadAndMarkAsRead();
      });
  }

  transform(imageToTransform) {
    if (imageToTransform) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(imageToTransform);
    }
  }

  filterUnreadAndMarkAsRead() {
    this.markAsRead(
      this.currentUserChats.filter(
        element => element.read == false && element.sendBy != this.userId
      )
    );
  }

  markAsRead(unreadMessages) {
    let data = [];
    unreadMessages.forEach(element => {
      data.push(element.id);
    });
    if (data.length > 0) this.chatService.setMessagesAsRead(data).subscribe();
  }


  onChat(): void {
    this.rbsSerive.getrbsrole(this.userId).subscribe((res: any) => {

      this.mla = res.find(roleName => roleName.role.name == 'Speaker' || roleName.role.name == 'NewActiveSpeaker' || roleName.role.name == 'PrivateSecretaryToSpeaker');
      this.loadChat(this.mla);
      this.IsnewactiveSpeaker = res.find(roleName => roleName.role.name == 'NewActiveSpeaker');
    })
  }

  loadChat(mla) {
    console.log(!this.IsSec);
    if (!this.mla && !this.IsSec) {
      this.chatService
        .getUserWiseUnreadCountOfSpeakerMessages(this.userId)
        .subscribe((res: any) => {
          if (res) {
            res.forEach(category => {
              category.values = category.values.filter(
                element => element && element.userId != this.userId
              );
            });
            this.members = res;
          }
        });
    } else {
      this.chatService
        .getUserWiseUnreadCount(this.userId)
        .subscribe((res: any) => {
          if (res) {
            console.log(res);
            res.forEach(category => {
              category.values = category.values.filter(
                element => element && element.userId != this.userId
              );
            });
            this.members = res;
          }
        });
    }
  }


  onSelectTemplate(item) {
    this.message = item;
    this.templateVisible = false;
  }
  getChatTemplates(deliveryGroup) {
    this.chatTemplates = [];
    let roles = this.authService.getCurrentUser().authorities;
    let role = '';
    if (roles.includes('speaker')) role = 'speaker';
    else if (roles.includes('newActivespeaker')) role = 'newActivespeaker';
    else if (roles.includes('MLA')) {
      role = 'MLA';
      deliveryGroup = 'speaker';
    }
    if (role) {
      this.chatService
        .getChatTemplates(
          role,
          deliveryGroup ? deliveryGroup.toLowerCase() : 'specialMembers'
        )
        .subscribe((res: any) => {
          this.chatTemplates = res;
        });
    }
  }
  ngOnDestroy() {
    this.activeUser = {};
    this.sub.unsubscribe();
  }
  clearAllMessage() {
    this.chatService.clearAllMessage().subscribe((res: any) => {
      if (res.statusCodeValue == 200) {
        this.notify.showSuccess(this.translate.instant('dashboard.notification.success'),
        this.translate.instant('dashboard.notification.chatremoved'));
        this.onChat();
      }
    });
  }

  speakerOrNot() {
    this.IsSpeaker = this.authService
      .getCurrentUser()
      .authorities.includes('speaker')
      ? true
      : false;

  }

  // newactivespeakerOrNot() {
  //   debugger;
  //   console.log(this.authService.getCurrentUser().authorities)
  //   this.IsnewactiveSpeaker = this.authService
  //     .getCurrentUser()
  //     .authorities.includes('newActivespeaker')
  //     ? true
  //     : false;  
  // }


  secretaryOrNot() {
    this.IsSec = this.authService
      .getCurrentUser()
      .authorities.includes('privateSecretaryToSpeaker')
      ? true
      : false;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  imageModal(img): void {
    this.imageForPreview = img;
    this.isImageVisible = true;
  }

  imageModalOk(): void {
    console.log('Button ok clicked!');
    this.isImageVisible = false;
  }

  imageModalCancel(): void {
    console.log('Button cancel clicked!');
    this.isImageVisible = false;
  }

  sendImage(url) {
    this.isVisible = false;
    this.imageUrl = url;
    if (this.imageUrl != null) {
      this.isImg = true;
    }
    this.transform(this.imageUrl);
    this.sendMessageUsingSocketImage();
  }

  sendMessageUsingSocketImage() {
    if (this.isImg == true) {
      let chat = {
        sendBy: this.userId,
        sendTo: this.activeUser.userId,
        message: '',
        image: this.imageUrl,
        isImg: this.isImg,
        important: this.isImp
      };
      this.chatService.postMessage(chat).subscribe(response => {
        // this.getParticularUserChatList(this.activeUser.member.userId);
      });
      this.isImp = false;
      this.isImg = false;
      this.image = '';
    }
  }
}
