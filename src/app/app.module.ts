import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/components/header/header.component';
import { FooterComponent } from './core/layout/components/footer/footer.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { HomeComponent } from './core/components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Page404Component } from './core/components/page404/page404.component';
import { SearchresultComponent } from './core/components/searchresult/searchresult.component';
import { SearchComponent } from './core/layout/components/header/search/search.component';
import { AuthLoggingInterceptorService } from './shared/services/auth/authinterceptor.service';
import { SharedModule } from './shared/shared.module';
import { TimeOfTheDayComponent } from './core/components/time-of-the-day/time-of-the-day.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAlertComponent } from './core/custom-alert/custom-alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import {NgOptimizedImage} from "@angular/common";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    Page404Component,
    SearchresultComponent,
    SearchComponent,
    TimeOfTheDayComponent,
    CustomAlertComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        SharedModule,
        MatSnackBarModule,
        NgOptimizedImage
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthLoggingInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
