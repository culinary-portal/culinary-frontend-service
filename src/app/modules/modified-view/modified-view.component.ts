/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeService } from "../recipe/services/recipe.service";
import { AuthService } from "../../shared/services/auth/auth.service";
import { UserPreferencesService } from "../user_preferences/services/user-preferences.service";
import { BaseRecipe } from "../recipe/model/base-recipe";
import { GeneralRecipeDetails } from "../generalrecipe/model/general-recipe-details";
import {Recipe} from "../recipe/model/recipe";

export interface JoinedRecipeDetails {
  generalRecipe: GeneralRecipeDetails;
  baseRecipe: BaseRecipe;
}

@Component({
  selector: 'app-modified-view',
  templateUrl: './modified-view.component.html',
  styleUrls: ['./modified-view.component.scss']
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
      this.fetchJoinedRecipeDetails(+id); // Fetch joined data for a single recipe
    } else {
      this.errorMessage = 'Invalid recipe ID.';
      this.loading = false;
    }
  }

  // Fetch and join data for a single recipe ID
  fetchJoinedRecipeDetails(recipeId: number): void {
    this.loading = true;

    // Fetch BaseRecipe by ID
    this.userPreferencesService.getRecipeById(recipeId).subscribe({
      next: (baseRecipe: BaseRecipe) => {
        if (!baseRecipe?.generalRecipeId) {
          console.error('GeneralRecipeId is missing or invalid in BaseRecipe.');
          this.errorMessage = 'The selected recipe does not have a valid general recipe associated with it.';
          this.loading = false;
          return;
        }

        // Fetch GeneralRecipeDetails using the generalRecipeId from BaseRecipe
        this.recipeService.getGeneralRecipeById(baseRecipe.generalRecipeId).subscribe({
          next: (generalRecipe: GeneralRecipeDetails) => {
            this.joinedRecipe = {
              baseRecipe,
              generalRecipe,
            }; // Combine BaseRecipe and GeneralRecipeDetails
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching General Recipe:', err);
            this.errorMessage = `Failed to load General Recipe details: ${err.message}`;
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching Base Recipe:', err);
        this.errorMessage = `Failed to load Base Recipe details: ${err.message}`;
        this.loading = false;
      },
    });
  }

  // Navigate back to the list
  goBack(): void {
    this.router.navigate(['/general-recipes']);
  }
  protected readonly Number = Number;
}
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe/services/recipe.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserPreferencesService } from '../user_preferences/services/user-preferences.service';
import { Recipe } from '../recipe/model/recipe';
import { GeneralRecipeDetails } from '../generalrecipe/model/general-recipe-details';

export interface JoinedRecipeDetails {
  generalRecipeid: GeneralRecipeDetails;
  baseRecipe: Recipe;
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

    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (recipe: Recipe) => {
        // Combine Recipe and its embedded GeneralRecipeDetails
        this.joinedRecipe = {
          baseRecipe: recipe,
          generalRecipe: recipe.generalRecipe,
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching Recipe:', err);
        this.errorMessage = `Failed to load Recipe details: ${err.message}`;
        this.loading = false;
      },
    });
  }

  // Navigate back to the list
  goBack(): void {
    this.router.navigate(['/general-recipes']);
  }
  protected readonly Number = Number;
}
