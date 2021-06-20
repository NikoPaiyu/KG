export class OutgoingMessage {
  toId: String;
  message: string;
}

export class IncommingMessage {
  toId: String;
  fromId: string;
  message: string;
}
