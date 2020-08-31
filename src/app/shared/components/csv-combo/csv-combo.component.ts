import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SelectOption } from '@app/core-api';

@Component({
  selector: 'md-csv-combo',
  templateUrl: './csv-combo.component.html',
  styleUrls: ['./csv-combo.component.scss']
})
export class CsvComboComponent {

  @Input() applyWidth = false;
  @Input() selectUp = false;
  @Input() emptyData: SelectOption = { text: 'Select default category...', id: '' };
  @Input() selectFirst = false;

  @Input() set header(header: string) {
    if (!header) {
      this.selectedOption = { ...this.emptyData };
    }
    this._header = header;
  }
  get header(): string { return this._header; }
  private _header = '';

  @Input() set headers(headers: Array<string>) {
    this.selectedOption = { ...this.emptyData };
    if (!headers) {
      this.selectOptions = undefined;
      return;
    }
    if (headers.length && this.selectFirst) {
      this.selectedOption = { id: 0, text: headers[0], value: 0 };
    }
    this.selectOptions = headers.map((header, index) => {
      return { id: index, text: header, value: index };
    });
  }

  @Output() onChange = new EventEmitter<string>();

  selectOptions: Array<SelectOption>;
  selectedOption: SelectOption = undefined;
  dataModel: any;

  changedOption(option: SelectOption): void {
    this.header = option.id.toString();
    this.onChange.emit(this.header);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyData.id);
  }

}
