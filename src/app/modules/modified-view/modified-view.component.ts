import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe/services/recipe.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { UserPreferencesService } from '../user_preferences/services/user-preferences.service';
import { GeneralRecipeDetails } from '../generalrecipe/model/general-recipe-details';




@Component({
  selector: 'app-modified-view',
  templateUrl: './modified-view.component.html',
  styleUrls: ['./modified-view.component.scss'],
})
export class ModifiedViewComponent implements OnInit {
  modifiedRecipe: GeneralRecipeDetails | null = null;
  loading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error handling
  userId: number | null = null;
  recipeId: number | null = null;
  isLoggedIn = false; // Track user login status

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.recipeId = +params['recipeId'];

      if (this.userId && this.recipeId) {

        this.fetchModifiedRecipe();
      } else {
        this.errorMessage = 'Invalid recipe or user ID';
        this.loading = false;
      }
    });
  }

  fetchModifiedRecipe(): void {
    this.userPreferencesService.getModifiedRecipesOne(this.userId, this.recipeId)
      .subscribe({
        next: (data: GeneralRecipeDetails []) => {
          this.modifiedRecipe = data[0];
          this.loading = false;
          console.log(this.modifiedRecipe)
        },
        error: (error) => {
          this.errorMessage = 'Failed to load the recipe. Please try again later.';
          this.loading = false;
        }
      });
  }
  goBack(): void {
    this.router.navigate(['/general-recipes']);
  }

  protected readonly Number = Number;
}
