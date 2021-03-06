import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Output() onNext = new EventEmitter<number>();
  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onToEnd = new EventEmitter();

  constructor(
    public editPatientService: EditPatientService
  ) { }

  cancel(): void {
    this.onCancel.emit();
  }

  toEnd(): void {
    this.onToEnd.emit();
    this.editPatientService.setTab(3);
  }

  next(i: number): void {
    this.onNext.emit(i);
  }

  save(): void {
    this.onSave.emit();
  }

  isShowOptions = false;

  showOptions(event: any): void {
    const f = this.isShowOptions;
    ComponentService.documentClick(event)
    this.isShowOptions = !f;
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isShowOptions = false;
  }
}
