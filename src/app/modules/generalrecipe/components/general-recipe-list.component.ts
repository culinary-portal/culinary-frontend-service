import {Component, OnInit} from '@angular/core';
import {GeneralRecipeService} from '../services/general-recipe.service';
import {GeneralRecipeDetails} from '../model/general-recipe-details';
import {loadJsonConfig} from '../../../shared/helper/loadConfigJson';
import {ActivatedRoute, Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";


@Component({
  selector: 'app-general-recipe-list',
  templateUrl: './general-recipe-list.component.html',
  styles: []
})
export class GeneralRecipeListComponent implements OnInit {
  generalRecipes: GeneralRecipeDetails[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  isLoading = true;
  error: string | null = null;
  minCalories: number | null = null;
  maxCalories: number | null = null;
  selectedDiets: string[] = [];
  configDietTypes: string[] = [];
  configMealTypes: string[] = [];
  selectedMealType: string | null = null;

  constructor(
    private generalRecipeService: GeneralRecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDietConfig();
    this.loadMealConfig();
    this.route.paramMap.subscribe(params => {
      this.selectedMealType = params.get('mealType');
      this.fetchRecipes();
    });
    this.loadMealConfig();
  }

  onMealTypeChange(): void {
    this.router.navigate(['/general-recipes/', this.selectedMealType || '']);
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
        this.error = 'Failed to load meal configuration';
      });
  }

  fetchRecipes(): void {
    this.isLoading = true;
    const filters = {
      diets: this.selectedDiets,
      minCalories: this.minCalories,
      maxCalories: this.maxCalories,
      mealType: this.selectedMealType,
      page: this.currentPage,
      size: this.pageSize
    };

    this.generalRecipeService.getGeneralRecipes(filters).subscribe({
      next: (data) => {
        this.generalRecipes = data;
        this.totalElements = data.length;
        this.isLoading = false;
      },
      error: (err: { message: string | null }) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
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
    const compare = (a: any, b: any) => criteria.endsWith('Increase') ? a - b : b - a;
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

  viewRecipeDetails(id: number): void {
    this.router.navigate(['/recipes', id]);
  }
}
