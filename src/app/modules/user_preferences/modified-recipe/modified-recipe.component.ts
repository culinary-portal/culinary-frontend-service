/*
import {Component, OnInit} from '@angular/core';
import {GeneralRecipeDetails} from "../../generalrecipe/model/general-recipe-details";
import {UserDetailsDTO} from "../../user/model/user-details";
import {UserPreferencesService} from "../services/user-preferences.service";
import {RecipeService} from "../../recipe/services/recipe.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";
import {BaseRecipe} from "../../recipe/model/base-recipe";

@Component({
  selector: 'app-modified-recipe',
  templateUrl: './modified-recipe.component.html',
  styleUrls: ['./modified-recipe.component.scss']
})
export class ModifiedRecipeComponent implements OnInit {
  modifiedRecipes: BaseRecipe[] = [];
  userId: number | null = null;
  user!: UserDetailsDTO;
  generalRecipe!: GeneralRecipeDetails | null;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.id) {
      this.userId = userDetails.id;
      this.loadPreferences();
    } else {
      console.error('User details not available! Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  loadPreferences(): void {
    if (!this.userId) {
      console.error('Cannot load preferences: User ID is missing.');
      return;
    }

    // Fetch modifiedRecipes
    this.userPreferencesService.getModifiedRecipes(this.userId).subscribe({
      next: (data: BaseRecipe[]) => {
        this.modifiedRecipes = data;

        if (this.modifiedRecipes.length > 0) {
          // Iterate over modified recipes to fetch exact GeneralRecipeDetails
          this.modifiedRecipes.forEach((recipe) => {
            this.recipeService.getGeneralRecipeById(recipe.generalRecipeId).subscribe({
              next: (generalRecipeDetails: GeneralRecipeDetails) => {
                // Match by recipeId
                if (generalRecipeDetails.baseRecipe.recipeId === recipe.recipeId) {
                  this.generalRecipe = generalRecipeDetails; // Assign the matched recipe
                }
              },
              error: (err) =>
                console.error('Error fetching GeneralRecipeDetails:', err),
            });
          });
        } else {
          console.warn('No modified recipes found for the user.');
        }
      },
      error: (err) => console.error('Error loading modified recipes:', err),
    });
  }
  viewRecipeDetails(id: number): void {
    this.router.navigate(['/recipes', id]); // Navigates to the details screen
  }

}


  /!*loadPreferences(): void {
    if (!this.userId) {
      console.error('Cannot load preferences: User ID is missing.');
      return;
    }

    // Fetch modifiedRecipes
    this.userPreferencesService.getModifiedRecipes(this.userId).subscribe({
      next: (data: BaseRecipe[]) => {
        this.modifiedRecipes = data;
        this.generalRecipe = this.recipeService.getGeneralRecipeById(this.modifiedRecipes.)
      },
      error: (err) => console.error('Error loading favorite recipes:', err),
    });
  }*!/

  /!*removeModifiedRecipe(recipeId: BaseRecipe): void {
      const confirmation = confirm('Are you sure you want to remove this recipe from your favorites?');
      if (!confirmation) {
        console.log('User canceled the recipe removal.');
        return; // If the user cancels, do nothing
      }

      console.log(`Attempting to remove recipe with ID ${recipeId} for user ID ${this.userId}...`);

      this.userPreferencesService.deleteModifiedRecipe(this.userId!, recipeId).subscribe({
        next: () => {
          console.log(`Recipe with ID ${recipeId} removed successfully.`);
          // Update the local modifiedRecipes array
          this.modifiedRecipes = this.modifiedRecipes.filter(
            (recipe) => recipe.generalRecipeId != recipe.contains.map()
          );
          // Notify the user of successful removal
          alert(`The recipe has been successfully removed from your favorites.`);
        },
        error: (err) => {
          console.error(`Error removing recipe with ID ${recipeId}:`, err);
          // Notify the user of the failure
          alert(`Failed to remove the recipe. Please try again later.`);
        },
      });
    }

    viewRecipeDetails(id: number): void {
      this.router.navigate(['/recipes', id]); // Navigates to the details screen
    }*!/
*/
import { Component, OnInit } from '@angular/core';
import { GeneralRecipeDetails } from '../../generalrecipe/model/general-recipe-details';
import { UserPreferencesService } from '../services/user-preferences.service';
import { RecipeService } from '../../recipe/services/recipe.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { BaseRecipe } from '../../recipe/model/base-recipe';

@Component({
  selector: 'app-modified-recipe',
  templateUrl: './modified-recipe.component.html',
  styleUrls: ['./modified-recipe.component.scss']
})
export class ModifiedRecipeComponent implements OnInit {
  modifiedRecipes: BaseRecipe[] = [];
  userId: number | null = null;
  generalRecipes: GeneralRecipeDetails[] = []; // Store all matched GeneralRecipeDetails

  constructor(
    private userPreferencesService: UserPreferencesService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.id) {
      this.userId = userDetails.id;
      this.loadPreferences();
    } else {
      console.error('User details not available! Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  loadPreferences(): void {
    if (!this.userId) {
      console.error('Cannot load preferences: User ID is missing.');
      return;
    }

    // Fetch modified recipes for the user
    this.userPreferencesService.getModifiedRecipes(this.userId).subscribe({
      next: (data: BaseRecipe[]) => {
        this.modifiedRecipes = data;

        if (this.modifiedRecipes.length > 0) {
          // Fetch all GeneralRecipeDetails for the modified recipes
          this.modifiedRecipes.forEach((recipe) => {
            this.fetchGeneralRecipe(recipe.generalRecipeId, recipe.recipeId);
          });
        } else {
          console.warn('No modified recipes found for the user.');
        }
      },
      error: (err) => console.error('Error loading modified recipes:', err),
    });
  }

  fetchGeneralRecipe(generalRecipeId: number, recipeId: number): void {
    this.recipeService.getGeneralRecipeById(generalRecipeId).subscribe({
      next: (generalRecipeDetails: GeneralRecipeDetails) => {
        // Match specific recipeId and push to the array if it matches
        if (generalRecipeDetails.baseRecipe.recipeId === recipeId) {
          this.generalRecipes.push(generalRecipeDetails);
        }
      },
      error: (err) => console.error('Error fetching GeneralRecipeDetails:', err),
    });
  }
}
