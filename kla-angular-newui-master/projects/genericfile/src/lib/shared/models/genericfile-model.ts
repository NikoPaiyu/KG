export interface BlockData {
  id: number;
  title: string;
  description: string;
}
export interface DocumentData {
  id: number;
  title: string;
  description: string;
  attachments: [
    {
      attachmentTitle: string;
      docUrl: string;
    }
  ];
}
