import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSibscriber, TranslateService, DateService, TableModel, TableComponent } from '@app/core-api';
import { Store } from '@ngrx/store';
import { load } from '@app/categorization/store/actions/categorization.actions';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { selectCategorization } from '@app/categorization/store/selectors/categorization.selector';

@Component({
  selector: 'md-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;

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

  ngOnInit() {
    super.add(
      this.store.select(selectCategorization).subscribe((categorization: any) => {
        this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(categorization.data);
      }));
    this.store.dispatch(load());
  }

}
