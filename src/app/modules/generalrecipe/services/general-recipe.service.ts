import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralRecipeDetails } from '../model/general-recipe-details';
import {environment} from "../../../../environments/environment";
import { PageEvent } from '@angular/material/paginator';
import {PagableGeneralRecipeDetails} from "../model/pagable-general-recipe-details";

@Injectable({
  providedIn: 'root'
})
export class GeneralRecipeService {
  private apiUrl = `${environment.apiUrl}/api/general-recipes`;
  private pageSize: number = 10;

  constructor(private http: HttpClient) {}

  getGeneralRecipes(filters: {
    minCalories: number | null;
    maxCalories: number | null;
    diets: string[];
    mealType: string | null;
    page: number;
    size: number;
  }): Observable<PagableGeneralRecipeDetails> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size);

    if (filters.diets && filters.diets.length > 0) {
      params = params.set('dietTypes', filters.diets.join(','));
    }
    if (filters.minCalories != null) {
      params = params.set('minCalories', filters.minCalories);
    }
    if (filters.maxCalories != null) {
      params = params.set('maxCalories', filters.maxCalories);
    }
    if (filters.mealType) {
      params = params.set('mealType', filters.mealType);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }
}
