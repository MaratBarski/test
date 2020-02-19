import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule, TranslateService, DataService } from '@mdclone/core';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent
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
export class AppModule { }
