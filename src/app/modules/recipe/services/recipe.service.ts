import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../model/recipe';
import { BaseRecipe } from '../model/base-recipe';
import {GeneralRecipeDetails} from "../../generalrecipe/model/general-recipe-details";
import { Review } from '../../review/model/review';
import {environment} from "../../../../environments/environment";
import {catchError} from "rxjs/operators";


@Injectable({
  providedIn: 'root', // Automatically provides this service to the entire application
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/api/recipes`;
  private reviewApiUrl = `${environment.apiUrl}/api/reviews`;
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // Fetch all recipes
  getAllRecipes(): Observable<any> {
    return this.http.get(this.apiUrl); // Fetch all recipes
  }

  getRecipeById(recipeId: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${recipeId}`);
  }

  getGeneralRecipeById(generalRecipeId: number): Observable<GeneralRecipeDetails> {
    return this.http.get<GeneralRecipeDetails>(`${environment.apiUrl}/api/general-recipes/${generalRecipeId}`);
  }
  // Create a new recipe
  createRecipe(recipe: any): Observable<any> {
    return this.http.post(this.apiUrl, recipe);
  }

  // Update an existing recipe
  updateRecipe(id: number, recipe: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/recipes/${id}`, recipe);
  }

  // Delete a recipe
  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recipes/${id}`);
  }

  // Fetch review by ID
  getReviewById(reviewId: number): Observable<Review> {
    return this.http.get<Review>(`${this.reviewApiUrl}/${reviewId}`);
  }

 getReviewsByGeneralRecipeId(generalRecipeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.reviewApiUrl}?generalRecipeId=${generalRecipeId}`);
  }

  submitReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/api/reviews`, review);
  }

  // Add a new review
  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.reviewApiUrl, review);
  }

  saveModifiedRecipe(modifiedRecipe: any, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/modifications`, modifiedRecipe);
  }



}
