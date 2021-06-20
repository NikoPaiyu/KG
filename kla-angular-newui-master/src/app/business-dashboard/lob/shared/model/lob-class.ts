export class Items {
  questionId: number;
  lobId: number;
  question: string;
  note: string;
  allotedTime: string;
  klaStatus: string;
  clauseList: [
    {
      id: number;
      clause: string;
    }
  ];
}
