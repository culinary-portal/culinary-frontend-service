import { Component, OnInit } from '@angular/core';
import { GeneralRecipeDetails } from '../../generalrecipe/model/general-recipe-details';
import { UserPreferencesService } from '../services/user-preferences.service';
import { RecipeService } from '../../recipe/services/recipe.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { BaseRecipe } from '../../recipe/model/base-recipe';

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
  joinedRecipe: JoinedRecipe | null = null; // Single object to store joined data
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

    this.userPreferencesService.getModifiedRecipes(this.userId).subscribe({
      next: (baseRecipes: BaseRecipe[]) => {
        if (baseRecipes.length > 0) {
          console.log('Base recipes received:', baseRecipes);
          this.fetchAndJoinRecipe(baseRecipes[0]); // Assuming a single recipe to match joinedRecipe
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

  fetchAndJoinRecipe(baseRecipe: BaseRecipe): void {
    if (!baseRecipe || !baseRecipe.generalRecipeId) {
      console.error('Invalid BaseRecipe or missing generalRecipeId:', baseRecipe);
      this.loading = false;
      return;
    }

    this.recipeService.getGeneralRecipeById(baseRecipe.generalRecipeId).subscribe({
      next: (generalRecipe: GeneralRecipeDetails) => {
        if (!generalRecipe) {
          console.warn(
            `No general recipe details found for BaseRecipe ID: ${baseRecipe.generalRecipeId}`
          );
        } else {
          console.log(
            `General recipe fetched successfully for BaseRecipe ID: ${baseRecipe.generalRecipeId}`
          );
          this.joinedRecipe = { baseRecipe, generalRecipe };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(
          `Error fetching recipe for BaseRecipe ID: ${baseRecipe.generalRecipeId}`,
          err
        );
        this.error = 'Error fetching general recipe: ' + err.message;
        this.loading = false;
      },
    });
  }

  viewRecipeDetails(id: number): void {
    this.router.navigate(['/modify_recipes', id]);
  }

  removeModifiedRecipe(recipeId: number): void {
    const confirmation = confirm('Are you sure you want to remove this recipe from your modified?');
    if (!confirmation) {
      console.log('User canceled the recipe removal.');
      return;
    }

    if (!this.userId || !this.joinedRecipe || this.joinedRecipe.baseRecipe.recipeId !== recipeId) {
      console.error('Invalid operation: User ID or joined recipe data mismatch.');
      return;
    }

    this.userPreferencesService.deleteModifiedRecipe(this.userId, recipeId).subscribe({
      next: () => {
        console.log(`Recipe with ID ${recipeId} removed successfully.`);
        this.joinedRecipe = null;
        alert(`The recipe has been successfully removed from your favorites.`);
      },
      error: (err) => {
        console.error(`Error removing recipe with ID ${recipeId}:`, err);
        alert(`Failed to remove the recipe. Please try again later.`);
      },
    });
  }
}
