import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule, ENV, LoginService, SocketService } from '@appcore';
import { StoreModule } from '@ngrx/store';
import { LoginComponent } from './login/login.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { Offline } from './shared/decorators/offline.decorator';
import { environment } from '@env/environment';
// import { DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TooltipModule,
    CoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
  ],
  providers: [
    HttpClientModule,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  @Offline('assets/offline/userData.json')
  private getUserDataUrl = `${environment.serverUrl}${environment.endPoints.userData}`;

  constructor(private loginService: LoginService, private socket: SocketService) {
    ENV.serverUrl = environment.serverUrl;
    ENV.loginUrl = environment.loginUrl;
    this.loginService.setUserData(this.getUserDataUrl);
    console.log(`Environment: ${environment.name}`);
    this.socket.start(`${environment.serverUrl}`, `${environment.wsRoute}/socket.io`);
  }
}
