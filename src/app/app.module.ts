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
import { RecipeComponent } from './modules/recipe/components/recipe.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { UserFavRecipesComponent } from './modules/user_preferences/user-fav-recipes/user-fav-recipes.component';
import { UserFavDietsComponent } from './modules/user_preferences/user-fav-diets/user-fav-diets.component';
import { SettingsComponent } from './modules/user_preferences/settings/settings.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatPaginatorModule} from "@angular/material/paginator";
import { SubstitutesComponent } from './modules/substitute/components/substitutes/substitutes.component';
import { ModifiedRecipeComponent } from './modules/user_preferences/modified-recipe/modified-recipe.component';
import { ModifiedViewComponent } from './modules/modified-view/modified-view.component';

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
    CustomAlertComponent,
    RecipeComponent,
    ProfileComponent,
    UserFavRecipesComponent,
    UserFavDietsComponent,
    SettingsComponent,
    SubstitutesComponent,
    ModifiedRecipeComponent,
    ModifiedViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,  // Required for Material animations
    MatPaginatorModule,       // Required for paginator
    MatTooltipModule,
    AppRoutingModule,
    SharedModule,
    MatSnackBarModule,
    NgOptimizedImage,
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
