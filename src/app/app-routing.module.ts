import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './core/components/login/login.component';
import {RegisterComponent} from './core/components/register/register.component';
import {Page404Component} from './core/components/page404/page404.component';
import {SearchresultComponent} from './core/components/searchresult/searchresult.component';
import {TimeOfTheDayComponent} from "./core/components/time-of-the-day/time-of-the-day.component";
import {GeneralRecipeListComponent} from "./modules/generalrecipe/components/general-recipe-list.component";

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '', component: HomeComponent},
  {
    path: 'login', component: LoginComponent,
  },
  {path: 'general-recipes', component: GeneralRecipeListComponent},
  {
    path: 'general-recipes',
    loadChildren: () => import('./modules/generalrecipe/generalrecipe.module').then(m => m.GeneralRecipeModule)
  }, {
    path: 'time-of-the-day',
    component: TimeOfTheDayComponent
  },
  {
    path: 'products', component: SearchresultComponent
  },

  {path: '**', component: Page404Component, data: {message: 'Oops... This is a Bad request'}},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
