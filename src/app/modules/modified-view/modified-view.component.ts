import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe/services/recipe.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserPreferencesService } from '../user_preferences/services/user-preferences.service';
import { Recipe } from '../recipe/model/recipe';
import { GeneralRecipeDetails } from '../generalrecipe/model/general-recipe-details';
import {Contains} from "../contains/model/contains";
import {Ingredient} from "../ingredient/ingredient";
import {BaseRecipe} from "../recipe/model/base-recipe";

export interface JoinedRecipeDetails {
  generalRecipe: GeneralRecipeDetails;
  baseRecipe: BaseRecipe;
}

@Component({
  selector: 'app-modified-view',
  templateUrl: './modified-view.component.html',
  styleUrls: ['./modified-view.component.scss'],
})
export class ModifiedViewComponent implements OnInit {
  joinedRecipe: JoinedRecipeDetails | null = null; // Store combined data for a single recipe
  loading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error handling
  userId: number | null = null;
  isLoggedIn = false; // Track user login status

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userId = userDetails.id;
    } else {
      console.warn('User details not found. Ensure user is logged in.');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecipeDetails(+id); // Fetch joined data for a single recipe
    } else {
      this.errorMessage = 'Invalid recipe ID.';
      this.loading = false;
    }
  }

  // Fetch Recipe details and directly use the embedded GeneralRecipeDetails
  fetchRecipeDetails(recipeId: number): void {
    this.loading = true;
    this.getRecipeById(recipeId)
      .then((recipe) => this.getGeneralRecipeAndCombine(recipe))
      .catch((error) => {
        console.error('Error:', error);
        this.errorMessage = error.message;
        this.loading = false;
      });
  }

// Fetch the Recipe by ID
  private getRecipeById(recipeId: number): Promise<BaseRecipe> {
    return new Promise((resolve, reject) => {
      this.userPreferencesService.getRecipeById(recipeId).subscribe({
        next: (recipe: BaseRecipe) => resolve(recipe),
        error: (err) => reject(new Error(`Failed to load Recipe details: ${err.message}`)),
      });
    });
  }

// Fetch GeneralRecipeDetails and combine with the BaseRecipe
  private getGeneralRecipeAndCombine(recipe: BaseRecipe): void {
    this.getGeneralRecipeById(recipe.generalRecipeId)
      .then((generalRecipe) => {
        this.joinedRecipe = {
          baseRecipe: recipe,
          generalRecipe: generalRecipe,
        };
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error fetching GeneralRecipeDetails:', error);
        this.errorMessage = error.message;
        this.loading = false;
      });
  }

// Fetch the GeneralRecipeDetails by ID
  private getGeneralRecipeById(generalRecipeId: number): Promise<GeneralRecipeDetails> {
    return new Promise((resolve, reject) => {
      this.recipeService.getGeneralRecipeById(generalRecipeId).subscribe({
        next: (generalRecipe: GeneralRecipeDetails) => resolve(generalRecipe),
        error: (err) => reject(new Error(`Failed to load General Recipe details: ${err.message}`)),
      });
    });
  }

  // Navigate back to the list
  goBack(): void {
    this.router.navigate(['/general-recipes']);
  }
  protected readonly Number = Number;
}
