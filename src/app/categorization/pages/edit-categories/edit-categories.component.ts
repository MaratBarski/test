import { Component, OnInit, ViewChild } from '@angular/core';
import { EditCategoryService } from '@app/categorization/services/edit-category.service';
import { BaseSibscriber, NavigationService, PageInfo } from '@appcore';
import { MapCategoryInfoComponent } from '@app/categorization/components/map-category-info/map-category-info.component';
import { EditCategoryTableComponent } from '@app/categorization/components/edit-category-table/edit-category-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MapCategoryHeaderComponent } from '@app/categorization/components/map-category-header/map-category-header.component';
import { MapCategoryTableComponent } from '@app/categorization/components/map-category-table/map-category-table.component';

@Component({
  selector: 'md-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss']
})
export class EditCategoriesComponent extends BaseSibscriber implements OnInit {

  get isValid(): boolean {
    return this.categoryHeader && this.categoryHeader.isValid
      && this.categoryInfo && this.categoryInfo.isValid
      && this.categoryTable && this.categoryTable.isValid;
  }
  selectedCategory: any;
  isLoading = false;
  mode: 'edit' | 'replace' = 'edit';

  @ViewChild('categoryHeader', { static: true }) categoryHeader: MapCategoryHeaderComponent;
  @ViewChild('categoryInfo', { static: true }) categoryInfo: MapCategoryInfoComponent;
  @ViewChild('categoryTable', { static: true }) categoryTable: EditCategoryTableComponent;
  @ViewChild('mapCategoryTable', { static: false }) mapCategoryTable: MapCategoryTableComponent;

  constructor(
    private editCategoryService: EditCategoryService,
    private navigationService: NavigationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.navigationService.currentPageID = undefined;//PageInfo.ManageHierarchies.id;
  }

  ngOnInit(): void {
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = u.get('id');
        super.add(
          this.editCategoryService.load(id).subscribe((res: any) => {
            this.selectedCategory = res;
            if (!res || !res.data || !res.data.hierarchyLevels) { return; }
            this.selectedCategory.data.hierarchyLevels = this.editCategoryService.sortHierarchyLevels(this.selectedCategory.data.hierarchyLevels);
          }));
      }));
  }

  save(): void {
    if (!this.selectedCategory) { return; }
    if (!this.selectedCategory.data) { return; }
    if (!this.selectedCategory.data.hierarchyLevels) { return; }
    const category = JSON.parse(JSON.stringify(this.selectedCategory));
    //alert(this.selectedCategory.data.notificationMessage);
    //alert(this.selectedCategory.data.description);
    //alert(this.selectedCategory.data.defaultLevelId);
    //alert(this.selectedCategory.data.hierarchyName);
    //alert(this.selectedCategory.data.hierarchyLevels[0].newHierarchyLevelName);
    category.data.hierarchyLevels.forEach((item: any) => {
      item.hierarchyLevelName = item.newHierarchyLevelName
      delete item.newHierarchyLevelName;
    });
    this.isLoading = true;
    super.add(
      this.editCategoryService.save(category).subscribe((res: any) => {
        this.isLoading = false;
      }));
  }

  cancel(): void {
    this.router.navigateByUrl('/categorization');
  }

  onNameChange(name: string): void {
    this.selectedCategory.data.hierarchyName = name;
  }

  oldCategories = [];
  formData: FormData;

  onHeadersChanged(event: any): void {
    this.mode = 'replace';
    this.formData = event.formData;
    this.oldCategories = event.categoryHeaders.map((str: any, i: number) => {
      return {
        hierarchyLevelName: str,
        sortValue: i
      };
    });
  }
}
