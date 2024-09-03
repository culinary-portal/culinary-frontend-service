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

  getGeneralRecipes(): Observable<GeneralRecipeDetails[]> {

    let observable = this.http.get<GeneralRecipeDetails[]>(this.apiUrl);
    console.log("general-recipe request", observable);
    return observable;
  }
}
