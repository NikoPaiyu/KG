import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-notice-process",
  templateUrl: "./notice-process.component.html",
  styleUrls: ["./notice-process.component.scss"]
})
export class NoticeProcessComponent implements OnInit {
  bodyStyle = {
    display: "flex",
    "flex-direction": "column",
    height: "100%"
  };
  current = 1;
  stepStatus = ["finish", "finish", "process", "wait", "wait"];
  labels = ["Notice Subject", "Notice Type", "Starting Point", "Creation Date"];
  visible = false;
  notesCard = [1, 2, 3, 4, 5];

  drawer(): void {
    this.visible = !this.visible;
  }

  constructor() {}

  ngOnInit() {}
}
