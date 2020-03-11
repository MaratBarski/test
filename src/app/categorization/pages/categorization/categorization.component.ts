import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSibscriber, TranslateService, DateService, TableModel, TableComponent } from '@app/core-api';
import { Store } from '@ngrx/store';
import { load } from '@app/categorization/store/actions/categorization.actions';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { selectCategorization } from '@app/categorization/store/selectors/categorization.selector';
import { InfoPopupComponent } from 'core/public-api';

@Component({
  selector: 'md-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('rowInfo', { static: true }) rowInfo: InfoPopupComponent;

  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  currentRow = { state: true }

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private categorizationService: CategorizationService,
    private store: Store<any>
  ) {
    super();
  }

  searchOptions = ['fileName'];

  searchComplite(text: string): void {
  }

  showInfo(event: any, item: any): void {
    this.rowInfo.display(event);
  }

  ngOnInit() {
    super.add(
      this.store.select(selectCategorization).subscribe((categorization: any) => {
        this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(categorization.data);
      }));
    this.store.dispatch(load());
  }

}
