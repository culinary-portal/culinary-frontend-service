import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstitutesService } from '../../services/substitutes.service';
import { GeneralRecipeDetails } from '../../../generalrecipe/model/general-recipe-details';
import { Contains } from '../../../contains/model/contains';
import { Substitute } from 'src/app/modules/substitute/substitute';
import { RecipeService } from "../../../recipe/services/recipe.service";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";
import {Ingredient} from "../../../ingredient/ingredient";
import {BigModel} from "src/app/modules/substitute/components/bigModel"
@Component({
  selector: 'app-substitutes',
  templateUrl: './substitutes.component.html',
  styleUrls: ['./substitutes.component.scss'],
})
export class SubstitutesComponent implements OnInit {
  generalRecipe: GeneralRecipeDetails | null = null;
  substitutesMap: { [ingredientId: number]: BigModel[] } = {}; // Map for substitutes
  allIngredients: Set<number> = new Set<number>(); // Use Set for unique ingredient IDs


  constructor(
    private route: ActivatedRoute,
    protected substitutesService: SubstitutesService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.queryParamMap.get('ingredientId');
    if (recipeId) {
      this.loadRecipe(+recipeId);
    } else {
      console.error('Recipe ID is missing in the route parameters.');
    }
  }

  /**
   * Load the recipe details and then fetch substitutes for all its ingredients.
   */
  loadRecipe(recipeId: number): void {
    this.recipeService.getGeneralRecipeById(recipeId).subscribe({
      next: (recipe: GeneralRecipeDetails) => {
        this.generalRecipe = recipe;
        this.loadSubstitutesForAllIngredients();
      },
      error: (err) => console.error('Error loading recipe:', err),
    });
  }


  loadSubstitutesForAllIngredients(): void {
    if (this.generalRecipe?.baseRecipe.contains) {
      this.generalRecipe.baseRecipe.contains.forEach((ingredient: Contains) => {
        this.substitutesService
          .getSubstitutesForIngredient(ingredient.ingredient.ingredientId)
          .subscribe({
            next: (substitutes: BigModel[]) => {
              console.log(
                'Fetched substitutes for ingredient:',
                ingredient.ingredient.name,
                substitutes[1]
              );
              this.substitutesMap[ingredient.ingredient.ingredientId] = substitutes;
              console.log('Substitutes Map:', this.substitutesMap);
            },
            error: (err) => {
              console.error('Error loading substitutes for ingredient:', err);
            },
          });
      });
    }
  }



  /*hasSubstitutes(ingredientId: number | undefined): boolean {
    return !!ingredientId && !!this.substitutesMap[ingredientId]?.length;
  }*/


  /*getSubstitutesForIngredient(ingredientId: number | undefined): { ingredientName: string; proportion: number }[] {
    if (!ingredientId) {
      return []; // Return an empty array if ingredientId is undefined
    }
    return this.substitutesMap[ingredientId] || []; // Safely return substitutes or an empty array
  }*/

 /* getSubstitutes(ingredientId: number | undefined): { ingredientName: string; proportion: number }[] | null {
    if (!ingredientId || !this.substitutesMap[ingredientId]) {
      return null;
    }
    return this.substitutesMap[ingredientId];
  }*/

  protected readonly Object = Object;
}
