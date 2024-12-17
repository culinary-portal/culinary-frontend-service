import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Substitute } from '../substitute';
import {Ingredient} from "../../ingredient/ingredient";
import {BigModel} from "../components/bigModel";

@Injectable({
  providedIn: 'root',
})
export class SubstitutesService {
  private apiUrl = `${environment.apiUrl}/api/substitutes`;

  constructor(private http: HttpClient) {
  }

  // Fetch substitutes for a given ingredient
  getSubstitutesForIngredient(ingredientId: number): Observable<BigModel[]> {
    return this.http.get<BigModel[]>(`${this.apiUrl}/ingredient?ingredientId=${ingredientId}`);
  }

  getIngredientDetails(ingredientId: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${environment.apiUrl}/api/ingredients/${ingredientId}`);
  }
}
