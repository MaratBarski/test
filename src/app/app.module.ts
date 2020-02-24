import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule, TranslateService, DataService, ENV } from '@mdclone/core';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    StoreModule.forRoot({})
  ],
  providers: [
    TranslateService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(){
  }
}
