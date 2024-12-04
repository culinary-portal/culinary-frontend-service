import { Component, OnInit } from '@angular/core';
import { UserPreferencesService } from '../services/user-preferences.service';
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../recipe/services/recipe.service';
import { GeneralRecipeDetails } from '../../generalrecipe/model/general-recipe-details';


@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-fav-recipes.component.html',
  styleUrls: ['./user-fav-recipes.component.scss'],
})

export class UserFavRecipesComponent implements OnInit {
  favoriteRecipes: GeneralRecipeDetails[] = [];
  userId: number | null = null;
  user!: UserDetailsDTO;

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

    // Fetch favorite recipes
    this.userPreferencesService.getFavoriteRecipes(this.userId).subscribe({
      next: (data: GeneralRecipeDetails[]) => {
        this.favoriteRecipes = data;
        console.log('Favorite Recipes Loaded:', this.favoriteRecipes);
      },
      error: (err) => console.error('Error loading favorite recipes:', err),
    });
  }

  fetchFavoriteRecipeDetails(recipeIds: number[]): void {
    if (!recipeIds || recipeIds.length === 0) {
      console.log('No favorite recipes found.');
      this.favoriteRecipes = [];
      return;
    }

    // Fetch full details for each recipe ID
    const recipeDetails: GeneralRecipeDetails[] = [];
    recipeIds.forEach((id) => {
      this.recipeService.getGeneralRecipeById(id).subscribe({
        next: (recipe) => {
          recipeDetails.push(recipe);
          // Update the list when all recipes are fetched
          if (recipeDetails.length === recipeIds.length) {
            this.favoriteRecipes = recipeDetails;
          }
        },
        error: (err) => console.error(`Error fetching recipe details for ID ${id}:`, err),
      });
    });
  }

  removeFavoriteRecipe(recipeId: number): void {
    const confirmation = confirm('Are you sure you want to remove this recipe from your favorites?');
    if (!confirmation) {
      console.log('User canceled the recipe removal.');
      return; // If the user cancels, do nothing
    }

    console.log(`Attempting to remove recipe with ID ${recipeId} for user ID ${this.userId}...`);

    this.userPreferencesService.removeFavoriteRecipe(this.userId!, recipeId).subscribe({
      next: () => {
        console.log(`Recipe with ID ${recipeId} removed successfully.`);
        // Update the local favoriteRecipes array
        this.favoriteRecipes = this.favoriteRecipes.filter(
          (recipe) => recipe.generalRecipeId !== recipeId
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
  }

}
