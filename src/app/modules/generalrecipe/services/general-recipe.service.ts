import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralRecipeDetails } from '../model/general-recipe-details';

@Injectable({
  providedIn: 'root'
})
export class GeneralRecipeService {
  private apiUrl = '/api/general-recipes';

  constructor(private http: HttpClient) {}

  getGeneralRecipes(filters: {
    minCalories: number | null;
    maxCalories: number | null;
    diets: string[];
    mealType: string | null;
  }): Observable<GeneralRecipeDetails[]> {
    let queryParams = [];

    if (filters.diets && filters.diets.length > 0) {
      queryParams.push(`dietTypes=${filters.diets.join(',')}`);
    }
    if (filters.minCalories != null) {
      queryParams.push(`minCalories=${filters.minCalories}`);
    }
    if (filters.maxCalories != null) {
      queryParams.push(`maxCalories=${filters.maxCalories}`);
    }
    if (filters.mealType) {
      queryParams.push(`mealType=${filters.mealType}`);
    }

    const urlWithParams = this.apiUrl + (queryParams.length ? `?${queryParams.join('&')}` : '');
    return this.http.get<GeneralRecipeDetails[]>(urlWithParams);
  }
}
