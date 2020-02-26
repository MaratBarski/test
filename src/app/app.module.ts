import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule, TranslateService, DataService, ENV } from '@mdclone/core';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './login/login.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http'
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
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
  ],
  providers: [
    TranslateService,
    DataService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
