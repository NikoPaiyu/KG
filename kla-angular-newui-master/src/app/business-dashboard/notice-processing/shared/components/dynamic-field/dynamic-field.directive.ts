import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig, statusConfig } from '../../field.interface';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { RichtextComponent } from '../richtext/richtext.component';
import { AllottedDatesComponent } from '../allotted-dates/allotted-dates';
import { TextAreaComponent } from '../textarea/textarea.component';
import { MinisterSubjectComponent } from '../portfolio-subject/portfolio-subject.component';
import { AnswerDateComponent } from '../answer-date/answer-date.component';
import { QuestionNumberComponent } from '../question-number/question-number.component';
import { QuestionTypeComponent } from '../question-type/question-type.component';
import { DebateDateComponent } from '../debate-date/debate-date.component';
import { ClauseComponent } from '../clauses/clauses.component';
import { SroNumberComponent } from '../sro-number/sro-number.component';

const componentMapper = {
  input: InputComponent,
  select: SelectComponent,
  date: DatepickerComponent,
  richtext: RichtextComponent,
  aod: AllottedDatesComponent,
  textarea: TextAreaComponent,
  aodministerlist: SelectComponent,
  portfoliosubject: MinisterSubjectComponent,
  questiontype: QuestionTypeComponent,
  questionlist: QuestionNumberComponent,
  questionanswerdate: AnswerDateComponent,
  questiondebatedate: AllottedDatesComponent,
  questionclause: ClauseComponent,
  cosdates: AllottedDatesComponent,
  sronumber:SroNumberComponent,
  amendment:RichtextComponent
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  @Input() FormData;
  @Input() status: statusConfig;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}
  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
    this.componentRef.instance.Formdata = this.FormData;
    this.componentRef.instance.status = this.status;
  }
}
