import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-lob-workflow",
  templateUrl: "./lob-workflow.component.html",
  styleUrls: ["./lob-workflow.component.scss"]
})
export class LobWorkflowComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  panels = [
    {
      active: true,
      disabled: false,
      name: "Questions entered in the separate list to be asked and answered",
      childPanel: [
        {
          active: true,
          name: "This is panel header 1-1 "
        },
        {
          active: false,
          name: "This is panel header 1-2"
        }
      ]
    },
    {
      active: false,
      disabled: true,
      name: "Questions entered in the separate list to be asked and answered 2"
    },
    {
      active: false,
      disabled: false,
      name: "Questions entered in the separate list to be asked and answered  3"
    }
  ];
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
