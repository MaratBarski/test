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
import { TranslateService } from './services/translate.service';
import { DataService } from './services/data.service';
import { LoginService } from './services/login.service';
import { ComponentService } from './services/component.service';
import { LocalStorageService } from './services/local-storage.service';
import { SocketService } from './services/socket.service';
import { PaginationPipe } from './pipes/pagination.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { TooltipDirective } from './directives/tooltip.directive';
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
import { DateService } from './services/date.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { user } from './store/reducers/user.reducer';
import { PopupComponent } from './components/popup/popup.component';
import { ModalMenuComponent } from './components/modal-menu/modal-menu.component';
import { MenuLinkComponent } from './components/menu-link/menu-link.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AutoCompliteComponent } from './components/auto-complite/auto-complite.component';
import { SwitchButtonComponent } from './components/switch-button/switch-button.component';
import { InfoPopupComponent } from './components/info-popup/info-popup.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

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
    AutoCompliteComponent,
    SwitchButtonComponent,
    InfoPopupComponent,
    ProgressComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    AutoCompliteComponent,
    SwitchButtonComponent,
    InfoPopupComponent,
    ProgressComponent,
    SideBarComponent
  ],
  entryComponents: [
    TableHeaderComponent
  ],
  providers: [
    TranslateService,
    DataService,
    LoginService,
    ComponentService,
    SocketService,
    DateService,
    LocalStorageService
    , {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
