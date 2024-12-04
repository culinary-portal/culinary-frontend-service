import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details'
import {RecipeComponent} from "../../recipe/components/recipe.component";
import {RecipeService} from "src/app/modules/recipe/services/recipe.service"

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private baseUrl = `${environment.apiUrl}/api`; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  addFavoriteRecipe(userId: number, recipeId: number): Observable<void> {
    console.log('Adding favorite recipe:', { userId, recipeId });
    return this.http.post<void>(`${this.baseUrl}/user/${userId}/favorite-recipes/${recipeId}`, {userId,recipeId});
  }

  removeFavoriteRecipe(userId: number, recipeId: number): Observable<void> {
    console.log('Removing favorite recipe:', { userId, recipeId });
    return this.http.delete<void>(`${this.baseUrl}/user/${userId}/favorite-recipes/${recipeId}`);
  }


  // Add a favorite diet
  addFavoriteDiet(userId: number, dietId: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/user/${userId}/favorite-diets/${dietId}`, {})
      .pipe(catchError(this.handleError));
  }

  // Remove a favorite diet
  removeFavoriteDiet(userId: number, dietId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/user/${userId}/favorite-diets/${dietId}`)
      .pipe(catchError(this.handleError));
  }

// Get favorite diets
  getFavoriteRecipes(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}/favorite-recipes`)
  }

  // Get favorite diets
  getFavoriteDiets(userId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/user/${userId}/favorite-diets`)
      .pipe(catchError(this.handleError));
  }

  updateFavoriteDiets(preferencesUpdate: { userId: number; dietTypeIds: number[] }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/user/${preferencesUpdate.userId}/favorite-diets`, preferencesUpdate)
      .pipe(catchError(this.handleError));
  }

  // Handle errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}

