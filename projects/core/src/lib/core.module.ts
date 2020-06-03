import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ButtonComponent } from './components/button/button.component';
import { MainTestComponent } from './components/main-test/main-test.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { IconComponent } from './components/icon/icon.component';
import { SvgLoaderComponent } from './components/svg-loader/svg-loader.component';
import { AutoSearchComponent } from './components/auto-search/auto-search.component';
import { SplitButtonComponent } from './components/split-button/split-button.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { SelectComponent } from './components/select/select.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { CheckBoxListComponent } from './components/check-box-list/check-box-list.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { LocalStorageService } from './services/local-storage.service';
import { PaginationPipe } from './pipes/pagination.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { TooltipDirective } from './directives/tooltip.directive';
import { ElementTooltipDirective } from './directives/elementtooltip.directive';
import { TableComponent } from './components/table/table.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { ShowDirective } from './directives/show.directive';
import { ComponentLoaderComponent } from './components/component-loader/component-loader.component';
import { SortTablePipe } from './pipes/sort-table.pipe';
import { TableDirective, TableHeaderDirective, TableItemDirective, TableRowDirective } from './directives/table.directive';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { SearchPipe } from './pipes/search.pipe';
import { VisibilityDirective } from './directives/visibility.directive';
import { TextBlockComponent } from './components/text-block/text-block.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { user } from './store/reducers/user.reducer';
import { PopupComponent } from './components/popup/popup.component';
import { ModalMenuComponent } from './components/modal-menu/modal-menu.component';
import { MenuLinkComponent } from './components/menu-link/menu-link.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { SwitchButtonComponent } from './components/switch-button/switch-button.component';
import { InfoPopupComponent } from './components/info-popup/info-popup.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { RouterModule } from '@angular/router';
import { FileNamePipe } from './pipes/file-name.pipe';
import { DateRangeSelectorComponent } from './components/date-range-selector/date-range-selector.component';
import { DownloadComponent } from './components/download/download.component';
import { ChartBarComponent } from './components/chart-bar/chart-bar.component';
import { VisibleHeadersPipe } from './pipes/visible-headers.pipe';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ImageComponent } from './components/image/image.component';
import { RowInfoComponent } from './components/row-info/row-info.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { ActionLinkPipe } from './pipes/action-link.pipe';
import { SvgDirective } from './directives/svg.directive';
import { ProgressMatchComponent } from './components/progress-match/progress-match.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { ShowNoticePipe } from './pipes/show-notice.pipe';
import { ColorTextDirective } from './directives/color-text.directive';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CheckValidDatePipe } from './pipes/check-valid-date.pipe';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

@NgModule({
  declarations: [
    ButtonComponent,
    MainTestComponent,
    TabsComponent,
    IconComponent,
    SvgLoaderComponent,
    AutoSearchComponent,
    TranslatePipe,
    SplitButtonComponent,
    CheckBoxComponent,
    ToggleButtonComponent,
    SelectComponent,
    TooltipDirective,
    ElementTooltipDirective,
    LoginComponent,
    LogoutComponent,
    ModalWindowComponent,
    CheckBoxListComponent,
    PaginationPipe,
    PaginatorComponent,
    TableComponent,
    TableHeaderComponent,
    ShowDirective,
    ComponentLoaderComponent,
    SortTablePipe,
    TableDirective,
    TableHeaderDirective,
    TableItemDirective,
    TableRowDirective,
    MainHeaderComponent,
    SearchPipe,
    VisibilityDirective,
    TextBlockComponent,
    PopupComponent,
    ModalMenuComponent,
    MenuLinkComponent,
    AccordionComponent,
    AutoCompleteComponent,
    SwitchButtonComponent,
    InfoPopupComponent,
    ProgressComponent,
    SideBarComponent,
    FileNamePipe,
    DateRangeSelectorComponent,
    DownloadComponent,
    ChartBarComponent,
    VisibleHeadersPipe,
    EmptyStateComponent,
    ImageComponent,
    RowInfoComponent,
    DateFilterComponent,
    ActionLinkPipe,
    SvgDirective,
    ProgressMatchComponent,
    FileUploaderComponent,
    NotificationsComponent,
    NotificationItemComponent,
    ShowNoticePipe,
    ColorTextDirective,
    CheckValidDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    DialogModule,
    CalendarModule,
    //BrowserModule,
    //BrowserAnimationsModule,
    StoreModule.forFeature('userInfo', user),
    StoreDevtoolsModule.instrument()
    // SocketIoModule.forRoot({ url: 'http://localhost:3000', options: {} })
  ],
  exports: [
    ButtonComponent,
    MainTestComponent,
    TabsComponent,
    IconComponent,
    SvgLoaderComponent,
    AutoSearchComponent,
    TranslatePipe,
    SplitButtonComponent,
    CheckBoxComponent,
    ToggleButtonComponent,
    SelectComponent,
    LoginComponent,
    LogoutComponent,
    TooltipDirective,
    ElementTooltipDirective,
    ModalWindowComponent,
    CheckBoxListComponent,
    PaginationPipe,
    PaginatorComponent,
    TableComponent,
    TableHeaderComponent,
    ShowDirective,
    TableDirective,
    TableHeaderDirective,
    TableItemDirective,
    TableRowDirective,
    VisibilityDirective,
    MainHeaderComponent,
    SearchPipe,
    TextBlockComponent,
    PopupComponent,
    ModalMenuComponent,
    MenuLinkComponent,
    AccordionComponent,
    AutoCompleteComponent,
    SwitchButtonComponent,
    InfoPopupComponent,
    ProgressComponent,
    SideBarComponent,
    FileNamePipe,
    DateRangeSelectorComponent,
    DownloadComponent,
    ChartBarComponent,
    EmptyStateComponent,
    ImageComponent,
    RowInfoComponent,
    DateFilterComponent,
    ActionLinkPipe,
    SvgDirective,
    ProgressMatchComponent,
    FileUploaderComponent,
    NotificationsComponent,
    ShowNoticePipe,
    ColorTextDirective,
    CheckValidDatePipe
  ],
  entryComponents: [
    TableHeaderComponent,
    RowInfoComponent
  ],
  providers: [
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
