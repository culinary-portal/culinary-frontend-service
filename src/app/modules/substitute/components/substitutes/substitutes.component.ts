/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstitutesService } from '../../services/substitutes.service';
import { GeneralRecipeDetails } from '../../../generalrecipe/model/general-recipe-details';
import { Contains } from '../../../contains/model/contains';
import { Substitute } from 'src/app/modules/substitute/substitute';
import { RecipeService } from "../../../recipe/services/recipe.service";
import {forkJoin, map, Observable, of} from "rxjs";
import { catchError } from "rxjs/operators";
import {Ingredient} from "../../../ingredient/ingredient";
import {BigModel} from "src/app/modules/substitute/components/bigModel"
import {Router} from "@angular/router";

@Component({
  selector: 'app-substitutes',
  templateUrl: './substitutes.component.html',
  styleUrls: ['./substitutes.component.scss'],
})
export class SubstitutesComponent implements OnInit {
  generalRecipe: GeneralRecipeDetails | null = null;
  substitutesMap: { [ingredientId: number]: BigModel[] } = {}; // Map for substitutes
  activeSubstituteId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    protected substitutesService: SubstitutesService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.queryParamMap.get('ingredientId');
    if (recipeId) {
      this.loadRecipe(+recipeId);
    } else {
      console.error('Recipe ID is missing in the route parameters.');
    }
  }

  /!**
   * Load the recipe details and then fetch substitutes for all its ingredients.
   *!/
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
                substitutes[0]["substituteId"]
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

  hasSubstitute(ingredientId: number): Observable<boolean> {
    return this.findSubstitute(ingredientId);
  }

  findSubstitute(ingredientId: number): Observable<boolean> {
    return this.substitutesService.getSubstitutesForIngredient(ingredientId).pipe(
      map((result: any) => {
        return Array.isArray(result) && result.length > 0; // Check if substitutes exist
      })
    );
  }

  viewSubstituteDetails(ingredientId: number): void {
    this.activeSubstituteId = ingredientId;
    this.router.navigate(['/substitutes/ingredient'], { queryParams: { ingredientId } });
  }

protected readonly Object = Object;
}
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstitutesService } from '../../services/substitutes.service';
import { GeneralRecipeDetails } from '../../../generalrecipe/model/general-recipe-details';
import { Contains } from '../../../contains/model/contains';
import { Substitute } from 'src/app/modules/substitute/substitute';
import { RecipeService } from "../../../recipe/services/recipe.service";
import {forkJoin, map, Observable, of} from "rxjs";
import { catchError } from "rxjs/operators";
import { Ingredient } from "../../../ingredient/ingredient";
import { BigModel } from "src/app/modules/substitute/components/bigModel";
import { Router } from "@angular/router";
import {UserDetailsDTO} from "../../../user/model/user-details";

@Component({
  selector: 'app-substitutes',
  templateUrl: './substitutes.component.html',
  styleUrls: ['./substitutes.component.scss'],
})
export class SubstitutesComponent implements OnInit {
  generalRecipe: GeneralRecipeDetails | null = null;
  substitutesMap: { [ingredientId: number]: BigModel[] } = {}; // Map for substitutes
  activeSubstituteId: number | null = null;
  newModifiedRecipe!: GeneralRecipeDetails; // Store the modified recipe
  user!: UserDetailsDTO;

  constructor(
    private route: ActivatedRoute,
    protected substitutesService: SubstitutesService,
    private recipeService: RecipeService,
    private router: Router
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
                substitutes[0]["substituteId"]
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

  hasSubstitute(ingredientId: number): Observable<boolean> {
    return this.findSubstitute(ingredientId);
  }

  findSubstitute(ingredientId: number): Observable<boolean> {
    return this.substitutesService.getSubstitutesForIngredient(ingredientId).pipe(
      map((result: any) => {
        return Array.isArray(result) && result.length > 0; // Check if substitutes exist
      })
    );
  }

  viewSubstituteDetails(ingredientId: number): void {
    this.activeSubstituteId = ingredientId;
    this.router.navigate(['/substitutes/ingredient'], { queryParams: { ingredientId } });
  }

  /**
   * Copy the existing recipe and modify the contains list.
   */
  modifyRecipe(substitutes: { [ingredientId: number]: BigModel }): void {
    if (!this.generalRecipe) {
      console.error('No recipe to modify.');
      return;
    }

    // Step 1: Clone the existing recipe
    this.newModifiedRecipe = JSON.parse(JSON.stringify(this.generalRecipe));

    // Step 2: Modify the contains list based on substitutes
    if (this.newModifiedRecipe.baseRecipe.contains) {
      this.newModifiedRecipe.baseRecipe.contains = this.newModifiedRecipe.baseRecipe.contains.map((ingredient) => {
        const substitute = substitutes[ingredient.ingredient.ingredientId];
        if (substitute) {
          return {
            ...ingredient,
            ingredient: { ...ingredient.ingredient, ingredientId: substitute.substituteId },
          };
        }
        return ingredient;
      });
    }
  }

  /**
   * Save the modified recipe and navigate to the modified recipes page.
   */
  saveModifiedRecipe(): void {
    if (!this.newModifiedRecipe) {
      console.error('No modified recipe to save.');
      return;
    }

    this.recipeService.saveModifiedRecipe(this.newModifiedRecipe,user).subscribe({
      next: (response) => {
        console.log('Modified recipe saved successfully:', response);
        this.router.navigate(['/modified-recipes'], { queryParams: { recipeId: response.id } });
      },
      error: (err) => console.error('Error saving modified recipe:', err),
    });
  }

  /**
   * Display the modified recipe details in the UI.
   */
  displayModifiedRecipe(): void {
    if (!this.newModifiedRecipe) {
      console.error('No modified recipe to display.');
      return;
    }

    console.log('Modified Recipe:', this.newModifiedRecipe);
    // Add logic to bind the modified recipe to the UI, such as updating a view model or state
  }

  protected readonly Object = Object;
}


