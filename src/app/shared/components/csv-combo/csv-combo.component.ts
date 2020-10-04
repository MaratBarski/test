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
  @Input() selectFirst = 1;

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
    if (headers.length > this.selectFirst && this.selectFirst >= 0) {
      this.selectedOption = { id: this.selectFirst, text: headers[this.selectFirst], value: this.selectFirst };
      this.dataModel = this.selectFirst;
    }
    this.selectOptions = headers.map((header, index) => {
      return { id: index, text: header, value: index };
    });
  }

  @Output() onChange = new EventEmitter<string>();

  selectOptions: Array<SelectOption>;
  selectedOption: SelectOption = undefined;
  dataModel = 0;

  changedOption(option: SelectOption): void {
    this.header = option.id.toString();
    this.onChange.emit(this.header);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyData.id);
  }

}
