import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRecipeService } from './services/general-recipe.service';
import {GeneralRecipeListComponent} from "./components/general-recipe-list.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {AppModule} from "../../app.module";

@NgModule({
  declarations: [
    GeneralRecipeListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatPaginatorModule,
    AppModule
  ],
  providers: [
    GeneralRecipeService
  ]
})
export class GeneralRecipeModule { }
