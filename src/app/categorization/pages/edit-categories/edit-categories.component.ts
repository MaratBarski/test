import { Component, OnInit } from '@angular/core';
import { EditCategoryService } from '@app/categorization/services/edit-category.service';
import { BaseSibscriber, NavigationService, PageInfo } from '@appcore';

@Component({
  selector: 'md-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss']
})
export class EditCategoriesComponent extends BaseSibscriber implements OnInit {

  selectedCategory: any;
  constructor(
    private editCategoryService: EditCategoryService,
    private navigationService: NavigationService,
  ) {
    super();
    this.navigationService.currentPageID = undefined;//PageInfo.ManageHierarchies.id;
  }

  ngOnInit(): void {
    super.add(
      this.editCategoryService.load().subscribe((res: any) => {
        this.selectedCategory = res;
        if (!res || !res.data || !res.data.hierarchyLevels) { return; }
        this.selectedCategory.data.hierarchyLevels = this.editCategoryService.sortHierarchyLevels(this.selectedCategory.data.hierarchyLevels);
      }));
  }

  save(): void {
    alert('save')
  }

  cancel(): void {
    alert('cancel')
  }

}
