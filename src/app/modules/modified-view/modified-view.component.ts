import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { RecipeService } from '../recipe/services/recipe.service';
import { GeneralRecipeDetails } from '../generalrecipe/model/general-recipe-details';
import { Recipe } from '../recipe/model/recipe';
import { Review } from '../review/model/review';
import { Ingredient } from '../ingredient/ingredient';
import { Contains } from '../contains/model/contains';

class JoinedRecipeDetails {
  generalRecipeId: number | undefined;
  name: string | undefined;
  photoUrl: string | undefined;
  mealType: string | undefined;
  description: string | undefined;
  baseRecipe: {
    recipeId: number;
    name: string;
    description: string;
    dietType: string;
    generalRecipeId: number;
    contains: Contains[];
  } | undefined;
  reviews: Review[] | undefined;
  recipes: Recipe[] | undefined;
  steps: string | undefined;
  rating: number | undefined;
  calories: number | undefined;
  protein: number | undefined;
  fat: number | undefined;
  carbohydrate: number | undefined;
}

@Component({
  selector: 'app-modified-view',
  templateUrl: './modified-view.component.html',
  styleUrls: ['./modified-view.component.scss'],
})
export class ModifiedViewComponent implements OnInit {
  joinedRecipes: JoinedRecipeDetails[] = []; // List of recipes
  selectedRecipe: JoinedRecipeDetails | null = null; // Store the selected recipe
  loading: boolean = true;
  errorMessage: string = '';
  userId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserDetails()?.id || null;

    if (this.userId) {
      this.fetchRecipes(this.userId);
    } else {
      this.errorMessage = 'User not logged in.';
      this.loading = false;
    }
  }

  fetchRecipes(userId: number): void {
    this.loading = true;

    this.recipeService.getModifications(userId).subscribe({
      next: (response: GeneralRecipeDetails[]) => {
        this.joinedRecipes = response.map((generalRecipeDetails) => ({
          generalRecipeId: generalRecipeDetails.generalRecipeId,
          name: generalRecipeDetails.name,
          photoUrl: generalRecipeDetails.photoUrl,
          mealType: generalRecipeDetails.mealType,
          description: generalRecipeDetails.description,
          baseRecipe: {
            recipeId: generalRecipeDetails.baseRecipe.recipeId,
            name: generalRecipeDetails.baseRecipe.name,
            description: generalRecipeDetails.baseRecipe.description,
            dietType: generalRecipeDetails.baseRecipe.dietType,
            generalRecipeId: generalRecipeDetails.baseRecipe.generalRecipeId,
            contains: generalRecipeDetails.baseRecipe.contains,
          },
          reviews: generalRecipeDetails.reviews || [],
          recipes: generalRecipeDetails.recipes || [],
          steps: generalRecipeDetails.steps || '',
          rating: generalRecipeDetails.rating || 0,
          calories: generalRecipeDetails.calories || 0,
          protein: generalRecipeDetails.protein || 0,
          fat: generalRecipeDetails.fat || 0,
          carbohydrate: generalRecipeDetails.carbohydrate || 0,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.errorMessage = `Failed to load recipes: ${err.message}`;
        this.loading = false;
      },
    });
  }

  selectRecipe(recipe: JoinedRecipeDetails): void {
    this.selectedRecipe = recipe; // Set the selected recipe
  }

  deselectRecipe(): void {
    this.selectedRecipe = null; // Deselect the recipe
  }
}
