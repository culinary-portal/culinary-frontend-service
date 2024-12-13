import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './core/components/login/login.component';
import {RegisterComponent} from './core/components/register/register.component';
import {Page404Component} from './core/components/page404/page404.component';
import {SearchresultComponent} from './core/components/searchresult/searchresult.component';
import {TimeOfTheDayComponent} from "./core/components/time-of-the-day/time-of-the-day.component";
import {GeneralRecipeListComponent} from "./modules/generalrecipe/components/general-recipe-list.component";
import {RecipeComponent} from "./modules/recipe/components/recipe.component";
import { ProfileComponent } from 'src/app/core/components/profile/profile.component';
import { UserFavRecipesComponent } from './modules/user_preferences/user-fav-recipes/user-fav-recipes.component';
import { UserFavDietsComponent } from './modules/user_preferences/user-fav-diets/user-fav-diets.component';
import{SettingsComponent} from "./modules/user_preferences/settings/settings.component";
import {SubstitutesComponent} from "./modules/substitute/components/substitutes/substitutes.component";
import {ModifiedRecipeComponent} from "./modules/user_preferences/modified-recipe/modified-recipe.component"
import {ModifiedViewComponent} from "./modules/modified-view/modified-view.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'time-of-the-day', component: TimeOfTheDayComponent},
  { path: 'general-recipes/:mealType', component: GeneralRecipeListComponent, pathMatch: 'full'},
  { path: 'general-recipes', component: GeneralRecipeListComponent},
  {
    path: 'general-recipes',
    loadChildren: () => import('./modules/generalrecipe/generalrecipe.module').then(m => m.GeneralRecipeModule)
  },
  { path: 'products', component: SearchresultComponent},
  { path: 'recipes/:id', component: RecipeComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'favorite-recipes', component: UserFavRecipesComponent },
  { path: 'favorite-diets', component: UserFavDietsComponent },
  { path:'settings',component: SettingsComponent},
  {path: 'my-modifications', component:ModifiedRecipeComponent},
  {path: 'modify_recipes/:userId/:recipeId', component:ModifiedViewComponent},
  { path: 'substitutes/ingredient', component: SubstitutesComponent }, // New route
  { path: '', redirectTo: '/general-recipes', pathMatch: 'full'},
  { path: '**', component: Page404Component, data: {message: 'Oops... This is a Bad request'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
