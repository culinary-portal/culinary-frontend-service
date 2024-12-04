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
  favoriteRecipes: any[] = [];
  favoriteDiets: any[] = [];
  userDetails: UserDetailsDTO | null = null;
  userId: number | null = null;
  generalRecipe: GeneralRecipeDetails | null = null;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private route: ActivatedRoute,
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
      next: (data: number[]) => {
        this.favoriteRecipes = data;
        console.log('Favorite Recipes Loaded:', this.favoriteRecipes);
      },
      error: (err) => console.error('Error loading favorite recipes:', err),
    });
  }

  addFavoriteDiet(dietId: number): void {
    if (!this.userId) {
      console.error('User ID is missing!');
      alert('You must be logged in to add a favorite diet.');
      return;
    }

    this.userPreferencesService.addFavoriteDiet(this.userId, dietId).subscribe({
      next: () => {
        console.log(`Diet ${dietId} added to favorites.`);
        alert('Diet added to favorites successfully!');
        this.loadPreferences(); // Reload preferences
      },
      error: (err) => {
        console.error('Error adding favorite diet:', err);
        alert('Failed to add diet to favorites. Please try again.');
      },
    });
  }

  addFavoriteRecipe(recipeId: number): void {
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }

    this.userPreferencesService.addFavoriteRecipe(this.userId, recipeId).subscribe({
      next: () => {
        console.log(`Recipe ${recipeId} added to favorites.`);
        alert('Recipe added to favorites successfully!');
        this.loadPreferences(); // Reload preferences
      },
      error: (err) => {
        console.error('Error adding favorite recipe:', err);
        alert('Failed to add recipe to favorites. Please try again.');
      },
    });
  }

  removeFavoriteRecipe(recipeId: number): void {
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }

    this.userPreferencesService.removeFavoriteRecipe(this.userId, recipeId).subscribe({
      next: () => {
        console.log(`Recipe ${recipeId} removed from favorites.`);
        alert('Recipe removed from favorites successfully!');
        this.loadPreferences(); // Reload preferences
      },
      error: (err) => {
        console.error('Error removing favorite recipe:', err);
        alert('Failed to remove recipe from favorites. Please try again.');
      },
    });
  }

}
