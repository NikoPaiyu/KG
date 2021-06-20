import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ChatDetails } from "../model/chatDetails";
import { environment } from "src/environments/environment";
import { count } from 'rxjs/operators';
@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getUsers(userId: number) {
    return this.http
      .get(`${environment.chat_api_url}/kla/services/v1/chats/${userId}`, {
        withCredentials: false
      })
      .map(users => this.mapUsersData(users));
  }

  postMessage(messages) {
    return this.http.post(
      `${environment.chat_api_url}/api/socket/sendMessage`,
      messages
    );
  }

  mapUsersData(users) {
    return users.map(user => {
      return this.mapUserData(user);
    });
  }
  mapUserData(user) {
    let userelement = new ChatDetails();
    userelement.chatId = user.chatId;
    userelement.initiatedBy = user.initiatedBy;
    userelement.initiatedTo = user.initiatedTo;
    userelement.time = user.time;
    return userelement;
  }

  update(user: ChatDetails) {
    let userData = {
      chatId: user.chatId,
      initiatedBy: user.initiatedBy,
      initiatedTo: user.initiatedTo,
      time: user.time
    };
    return this.http.put(`${environment.chat_api_url}/users/update`, userData);
  }

  getchatmessages(searchParam: string) {
    return this.http
      .get(
        `${environment.chat_api_url}/kla/services/v1/chats/{chatId}/messages`
      )
      .map(users => this.mapChatData(users));
  }

  mapChatData(users) {
    return users.map(user => {
      return this.mapUserchatData(user);
    });
  }
  mapUserchatData(user) {
    let userelement = new ChatDetails();
    userelement.chatId = user.chatId;
    userelement.initiatedBy = user.initiatedBy;
    userelement.initiatedTo = user.initiatedTo;
    userelement.time = user.time;
    return userelement;
  }

  getUserWiseUnreadCount(userId) {
    return this.http
      .get(`${environment.chat_api_url}/api/socket/chatList/${userId}`)
      .map(users => users);
  }
  getUserWiseUnreadCountOfSpeakerMessages(userId) {
    return this.http
      .get(`${environment.chat_api_url}/api/socket/chatWithSpeaker/${userId}`)
      .map(users => users);
  }
  getParticularUserChatList(userId, currentUserId) {
    return this.http
      .get(
        `${environment.chat_api_url}/api/socket/chatList/${userId}/${currentUserId}`
      )
      .map(chat => chat);
  }

  setMessagesAsRead(messages = []) {
    return this.http.post(
      `${environment.chat_api_url}/api/socket/readMessages`,
      messages
    );
  }

  getUserUnreadMessageCount(userId) {
  
    return this.http
      .get(
        `${environment.chat_api_url}/api/socket/countAll/unreadMessage/${userId}`
      )
      .map(count => count);
      console.log(count)
      
  }

  getChatTemplates(userrole, deliverTo) {
    return this.http
      .get(
        `${environment.chat_api_url}/api/socket/getChatSuggestionsByDeliveryGroup?roleType=${userrole}&deliveryGroup=${deliverTo}`
      )
      .map(res => res);
  }
  clearAllMessage() {
    return this.http
      .delete(`${environment.chat_api_url}/api/socket/deleteChat`)
      .map(res => res);
  }
}
