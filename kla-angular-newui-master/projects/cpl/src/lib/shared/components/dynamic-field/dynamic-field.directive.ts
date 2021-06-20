import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { RichtextComponent } from '../richtext/richtext.component';

const componentMapper = {
  input: InputComponent,
  select: SelectComponent,
  date: DatepickerComponent,
  richtext: RichtextComponent
};
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
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
  }
}
