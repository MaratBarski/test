import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Output() onNext = new EventEmitter<1 | -1>();
  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onToEnd = new EventEmitter();

  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
  }

  cancel(): void {
    this.onCancel.emit();
  }

  toEnd(): void {
    this.onToEnd.emit();
    this.editPatientService.setTab(3);
  }

  next(i: 1 | -1): void {
    this.onNext.emit(i);
  }

  save(): void {

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
