import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../model/recipe';
import {GeneralRecipeDetails} from "../../generalrecipe/model/general-recipe-details";
import { Review } from '../../review/model/review';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {UserPreferencesService} from "src/app/modules/user_preferences/services/user-preferences.service";
import { SubstitutesService } from "../../substitute/services/substitutes.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  generalRecipe: GeneralRecipeDetails | null = null;
  recipe: Recipe | null = null;// Allow null during initialization// Store Recipe details
  loading: boolean = true; // Loading indicator
  errorMessage: string = ''; // Error handling
  reviews: Review[] = [];
  userId: number | null = null;

  newReview: Review = {
    reviewId: 0,
    userId: 0,
    generalRecipeId: 0,
    rating: 0, // Captured from radio buttons
    opinion: '',
  };

  isLoggedIn = false; // Track user login status


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private userPreferencesService: UserPreferencesService,
    private substitutesService: SubstitutesService,
  ) {
  }

  ngOnInit(): void {

    this.isLoggedIn = this.authService.isLoggedIn();

    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.newReview.userId = userDetails.id; // Set userId for new review
      this.userId = userDetails.id;
    } else {
      console.warn('User details not found. Ensure user is logged in.');
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchRecipeDetails(+id)
      this.fetchGeneralRecipeDetails(+id); // Fetch Recipe details
      this.fetchReviews(+id);
      /*this.loadFavoriteRecipes();*/
    } else {
      this.errorMessage = 'Invalid recipe ID.';
      this.loading = false;
    }


  }

  // Fetch Recipe Details
  fetchRecipeDetails(recipeId: number): void {
    this.recipeService.getRecipeById(recipeId).subscribe({
      next: (data: Recipe) => {
        this.recipe = data; // Assign Recipe details
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching Recipe:', err);
        this.errorMessage = 'Failed to load Recipe details.';
        this.loading = false;
      },
    });
  }

  fetchGeneralRecipeDetails(generalRecipeId: number): void {
    this.recipeService.getGeneralRecipeById(generalRecipeId).subscribe({
      next: (data: GeneralRecipeDetails) => {
        console.log('General Recipe fetched successfully:', data); // Debugging log
        this.generalRecipe = data; // Assign fetched General Recipe data
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching General Recipe:', err); // Debugging log
        this.errorMessage = `Failed to load Recipe details. Error: ${err.message || 'Unknown error'}`;
        this.loading = false;
      },
    });
  }


  // Navigate back to the list
  goBack(): void {
    this.router.navigate(['/general-recipes']);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }


  fetchReviews(generalRecipeId: number): void {
    this.recipeService.getReviewsByGeneralRecipeId(generalRecipeId).subscribe({
      next: (data: Review[]) => {
        // Filter reviews by the specific generalRecipeId (if needed)
        this.reviews = data.filter(review => review.generalRecipeId === generalRecipeId);
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.errorMessage = 'Failed to load reviews.';
      },
    });
  }

  submitReview(): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to submit a review.');
      return;
    }

    if (this.newReview.rating <= 0 || !this.newReview.opinion.trim()) {
      alert('Please provide a rating and write an opinion.');
      return;
    }

    if (!this.generalRecipe?.generalRecipeId) {
      alert('Recipe details are not loaded yet. Please try again later.');
      return;
    }

    const review: Review = {
      ...this.newReview,
      generalRecipeId: this.generalRecipe.generalRecipeId,
    };

    this.recipeService.submitReview(review).subscribe({
      next: (response) => {
        alert('Review submitted successfully!');
        this.reviews.push(response); // Add review to the list
        this.newReview.rating = 0; // Reset rating
        this.newReview.opinion = ''; // Clear opinion field
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit the review. Please try again.');
      },
    });
  }

  saveRecipe(): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to save a recipe.');
      return;
    }

    if (!this.generalRecipe?.generalRecipeId) {
      alert('Recipe details are not loaded yet. Please try again later.');
      return;
    }

    const recipeId = this.generalRecipe.generalRecipeId;

    this.userPreferencesService.addFavoriteRecipe(this.userId!, recipeId).subscribe({
      next: () => {
        alert('Recipe saved to favorites successfully!');
      },
      error: (err) => {
        console.error('Error saving recipe to favorites:', err);
        alert('Failed to save the recipe to favorites. Please try again.');
      },
    });
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



  protected readonly Number = Number;
}



