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
import {UserService} from "../../../user/services/user.service";
import {AuthService} from "../../../../shared/services/auth/auth.service";

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
  error: string | null = null;
  selectedSubstitutes: { [ingredientId: number]: BigModel[] } = {};

  constructor(
    private route: ActivatedRoute,
    protected substitutesService: SubstitutesService,
    private recipeService: RecipeService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.queryParamMap.get('ingredientId');
    if (recipeId) {
      this.loadRecipe(+recipeId);
    } else {
      console.error('Recipe ID is missing in the route parameters.');
    }

    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      this.router.navigate(['/login']);
      return;
    }
    const userDetails = this.authService.getUserDetails();
    if (userDetails?.id) {
      this.userService.getUserDetails(userDetails.id).subscribe({
        next: (userDetails) => {
          this.user = userDetails;
        },
        error: (err) => {
          this.error = 'Failed to load user details.';
          console.error(err);
        },
      });
    } else {
      // Handle case where userDetails is null or id is missing
      this.error = 'User ID is missing. Please log in again.';
      this.authService.logout();
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
   * Save the modified recipe with selected substitutes.
   */
  saveModifiedRecipe(): void {
    if (!this.generalRecipe) {
      console.error('No recipe to modify.');
      return;
    }

    // Step 1: Clone the existing recipe
    this.newModifiedRecipe = JSON.parse(JSON.stringify(this.generalRecipe));

    // Step 2: Apply selected substitutes
    if (this.newModifiedRecipe.baseRecipe.contains) {
      this.newModifiedRecipe.baseRecipe.contains = this.newModifiedRecipe.baseRecipe.contains.map((ingredient) => {
        const selectedSubstitute = this.selectedSubstitutes[ingredient.ingredient.ingredientId];
        if (selectedSubstitute && selectedSubstitute.length > 0) {
          return {
            ...ingredient,
            ingredient: {
              ...ingredient.ingredient,
              ingredientId: selectedSubstitute[0].substituteId, // Use the first substitute for simplicity
            },
          };
        }
        return ingredient;
      });
    }

    // Validate that user ID exists
    if (!this.user || !this.user.id) {
      console.error('User ID is missing. Unable to save modified recipe.');
      return;
    }

    // Step 3: Save the modified recipe
    const payload = {
      name: this.newModifiedRecipe.name,
      description: this.newModifiedRecipe.description,
      dietType: this.newModifiedRecipe.baseRecipe.dietType,
      generalRecipeId: this.newModifiedRecipe.generalRecipeId,
      contains: this.newModifiedRecipe.baseRecipe.contains.map((ingredient) => ({
        containsId: this.newModifiedRecipe.baseRecipe.contains.,
        amount: ingredient.amount,
        measure: ingredient.measure,
        recipeId: ingredient.recipeId,
        ingredientId: ingredient.ingredient.ingredientId,
      })),
    };

    this.recipeService.saveModifiedRecipe(payload, this.user.id).subscribe({
      next: (response) => {
        console.log('Modified recipe saved successfully:', response);
        this.router.navigate(['/modified-recipes'], { queryParams: { recipeId: response.id } });
      },
      error: (err) => console.error('Error saving modified recipe:', err),
    });
  }

  protected readonly Object = Object;
}




