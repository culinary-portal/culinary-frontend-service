import { Component, OnInit } from '@angular/core';
import { GeneralRecipeService } from '../services/general-recipe.service';
import { GeneralRecipeDetails } from '../model/general-recipe-details';

@Component({
  selector: 'app-general-recipe-list',
  templateUrl: './general-recipe-list.component.html',
  styles: []
})
export class GeneralRecipeListComponent implements OnInit {
  generalRecipes: GeneralRecipeDetails[] = [];
  isLoading = true;
  error: string | null = null;
  skeletons: number[] = [...new Array(6)];


  constructor(private generalRecipeService: GeneralRecipeService) {}

  ngOnInit(): void {
    this.generalRecipeService.getGeneralRecipes().subscribe({
      next: (recipes: GeneralRecipeDetails[]) => {
        console.log(recipes);
        this.generalRecipes = recipes;
        this.isLoading = false;
      },
      error: (err: { message: string | null; }) => {
        console.log(err)
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }
}
