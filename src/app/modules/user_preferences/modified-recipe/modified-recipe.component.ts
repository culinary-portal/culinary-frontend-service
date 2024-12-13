import { Component, OnInit } from '@angular/core';
import { GeneralRecipeDetails } from '../../generalrecipe/model/general-recipe-details';
import { UserPreferencesService } from '../services/user-preferences.service';
import { RecipeService } from '../../recipe/services/recipe.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { BaseRecipe } from '../../recipe/model/base-recipe';
import { forkJoin } from 'rxjs';

interface JoinedRecipe {
  baseRecipe: BaseRecipe;
  generalRecipe: GeneralRecipeDetails;
}

@Component({
  selector: 'app-modified-recipe',
  templateUrl: './modified-recipe.component.html',
  styleUrls: ['./modified-recipe.component.scss'],
})
export class ModifiedRecipeComponent implements OnInit {
  joinedRecipes: JoinedRecipe[] = []; // Array to store joined data
  userId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

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
      this.error = 'Cannot load preferences: User ID is missing.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Step 1: Fetch modified recipes
    this.userPreferencesService.getModifiedRecipes(this.userId).subscribe({
      next: (baseRecipes: BaseRecipe[]) => {
        if (baseRecipes.length > 0) {
          // Step 2: Fetch GeneralRecipeDetails for all base recipes
          this.fetchAndJoinRecipes(baseRecipes);
        } else {
          this.loading = false;
          this.error = 'No modified recipes found for the user.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error loading modified recipes: ' + err.message;
        console.error(this.error, err);
      },
    });
  }

  fetchAndJoinRecipes(baseRecipes: BaseRecipe[]): void {
    const requests = baseRecipes.map((baseRecipe) =>
      this.recipeService.getGeneralRecipeById(baseRecipe.generalRecipeId)
    );

    forkJoin(requests).subscribe({
      next: (generalRecipes: GeneralRecipeDetails[]) => {
        // Join BaseRecipe with GeneralRecipeDetails
        this.joinedRecipes = baseRecipes.map((baseRecipe) => {
          const generalRecipe = generalRecipes.find(
            (gr) => gr.generalRecipeId === baseRecipe.generalRecipeId
          );
          return { baseRecipe, generalRecipe: generalRecipe! }; // Ensure the match exists
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error fetching general recipes: ' + err.message;
        console.error(this.error, err);
      },
    });
  }


  viewRecipeDetails(id: number): void {
    this.router.navigate(['/modify_recipes', id]); // Navigates to the details screen
  }

  removeModifiedRecipe(recipeId: number): void {
    const confirmation = confirm('Are you sure you want to remove this recipe from your modified?');
    if (!confirmation) {
      console.log('User canceled the recipe removal.');
      return;
    }

    console.log('Attempting to remove recipe with ID ${recipeId} for user ID ${this.userId}...');

    this.userPreferencesService.deleteModifiedRecipe(this.userId!, recipeId).subscribe({
      next: () => {
        console.log('Recipe with ID ${recipeId} removed successfully.');
        // Update the local joinedRecipes array
        this.joinedRecipes = this.joinedRecipes.filter(
          (recipe) => recipe.baseRecipe.recipeId !== recipeId
        );
        alert('The recipe has been successfully removed from your favorites.');
      },
      error: (err) => {
        console.error('Error removing recipe with ID ${recipeId}:, err');
        alert('Failed to remove the recipe. Please try again later.');
      },
    });
  }
}
