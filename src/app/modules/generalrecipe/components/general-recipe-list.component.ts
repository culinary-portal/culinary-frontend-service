import {Component, OnInit} from '@angular/core';
import {GeneralRecipeService} from '../services/general-recipe.service';
import {GeneralRecipeDetails} from '../model/general-recipe-details';
import {loadJsonConfig} from '../../../shared/helper/loadConfigJson';


@Component({
  selector: 'app-general-recipe-list',
  templateUrl: './general-recipe-list.component.html',
  styles: []
})
export class GeneralRecipeListComponent implements OnInit {
  generalRecipes: GeneralRecipeDetails[] = [];
  isLoading = true;
  error: string | null = null;
  minCalories: number | null = null;
  maxCalories: number | null = null;
  selectedDiets: string[] = [];
  configDietTypes: string[] = [];
  configMealTypes: string[] = [];
  selectedMealType: string | null = null;

  constructor(private generalRecipeService: GeneralRecipeService) {
  }

  ngOnInit(): void {
    this.loadDietConfig();
    this.fetchRecipes();
    this.loadMealConfig()
  }

  loadDietConfig(): void {
    loadJsonConfig('diet-config.json')
      .then((config) => {
        this.configDietTypes = config.dietTypes;
      })
      .catch(() => {
        this.error = 'Failed to load diet configuration';
      });
  }


  loadMealConfig(): void {
    loadJsonConfig('meal-config.json')
      .then((config) => {
        this.configMealTypes = config.configMealTypes;
      })
      .catch(() => {
        this.error = 'Failed to load diet configuration';
      });
  }

  fetchRecipes(): void {
    this.isLoading = true;
    const filters = {
      diets: this.selectedDiets,
      minCalories: this.minCalories,
      maxCalories: this.maxCalories,
      mealType: this.selectedMealType
    };

    this.generalRecipeService.getGeneralRecipes(filters).subscribe({
      next: (recipes: GeneralRecipeDetails[]) => {
        this.generalRecipes = recipes;
        this.isLoading = false;
      },
      error: (err: { message: string | null }) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  onDietFilterChange(event: any): void {
    const diet = event.target.value;
    if (event.target.checked) {
      this.selectedDiets.push(diet);
    } else {
      this.selectedDiets = this.selectedDiets.filter(d => d !== diet);
    }
    this.fetchRecipes();
  }

  onFilterByCalories(): void {
    this.fetchRecipes();
  }

  sortRecipes(criteria: string): void {
    switch (criteria) {
      case 'caloriesIncrease':
        this.generalRecipes.sort((a, b) => a.calories - b.calories);
        break;
      case 'caloriesDecrease':
        this.generalRecipes.sort((a, b) => b.calories - a.calories);
        break;
      case 'proteinIncrease':
        this.generalRecipes.sort((a, b) => a.protein - b.protein);
        break;
      case 'proteinDecrease':
        this.generalRecipes.sort((a, b) => b.protein - a.protein);
        break;
      case 'rankingIncrease':
        this.generalRecipes.sort((a, b) => a.rating - b.rating);
        break;
      case 'rankingDecrease':
        this.generalRecipes.sort((a, b) => b.rating - a.rating);
        break;
    }
  }
}
