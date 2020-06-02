import { Component, OnInit } from '@angular/core';
import { MapCategoryService } from '@app/categorization/services/map-category.service';
import { BaseSibscriber, NavigationService, PageInfo } from '@appcore';

@Component({
  selector: 'md-map-categories',
  templateUrl: './map-categories.component.html',
  styleUrls: ['./map-categories.component.scss']
})
export class MapCategoriesComponent extends BaseSibscriber implements OnInit {

  selectedCategory: any;
  constructor(
    private mapCategoryService: MapCategoryService,
    private navigationService: NavigationService,
  ) {
    super();
    this.navigationService.currentPageID = undefined;//PageInfo.ManageHierarchies.id;
  }

  ngOnInit(): void {
    super.add(
      this.mapCategoryService.load().subscribe((res: any) => {
        this.selectedCategory = res;
      }));
  }

  save():void{
    alert('save')
  }

  cancel():void{
    alert('cancel')
  }
}
