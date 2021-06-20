import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../../field.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.scss']
})
export class RichtextComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}

  ngOnInit() {
  }

}
