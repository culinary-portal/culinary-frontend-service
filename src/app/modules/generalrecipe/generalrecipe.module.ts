import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRecipeService } from './services/general-recipe.service';
import {GeneralRecipeListComponent} from "./components/general-recipe-list.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    GeneralRecipeListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    GeneralRecipeService
  ]
})
export class GeneralRecipeModule { }
