import {Component, OnInit} from '@angular/core';
import {GeneralRecipeService} from '../services/general-recipe.service';
import {GeneralRecipeDetails} from '../model/general-recipe-details';
import {loadJsonConfig} from '../../../shared/helper/loadConfigJson';
import {PageEvent} from "@angular/material/paginator";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Diet} from "../../diet/model/diet";
import {UserPreferencesService} from "../../user_preferences/services/user-preferences.service";
import {forkJoin} from "rxjs";

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
  isLoggedIn = false;
  error: string | null = null;
  minCalories: number | null = null;
  maxCalories: number | null = null;
  selectedDiets: string[] = [];
  configDietTypes: Diet[] = [];
  configMealTypes: string[] = [];
  selectedMealType: string | null = null;
  favouriteDiets: Diet[] = [];

  userId: number | undefined; // Assuming userId is available after login

  constructor(
    private generalRecipeService: GeneralRecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private userPreferencesService: UserPreferencesService
  ) {}

  ngOnInit(): void {

    this.isLoggedIn = this.authService.isLoggedIn(); // Check if the user is logged in
    if (this.isLoggedIn) {
      const userDetails = this.authService.getUserDetails(); // Retrieve user details
      if (userDetails && userDetails.id) {
        this.userId = userDetails.id; // Set userId from user details
      } else {
        console.error('User details are missing or invalid.');
      }
    }
    this.loadAllData();

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
    this.userPreferencesService.getAllDiets().subscribe(
      (data: Diet[]) => {
        this.configDietTypes = data;
      },
      (error: any) => {
        console.error('Error fetching available diets:', error);
        alert('Failed to load available diets. Please try again later.');
      }
    );
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


  loadAllData(): void {
    const diets$ = this.http.get<Diet[]>(`${environment.apiUrl}/api/diet-types`);

    // Only fetch favourite diets if the user is logged in and userId is defined
    const favouriteDiets$ = this.isLoggedIn && this.userId
      ? this.http.get<Diet[]>(`${environment.apiUrl}/api/user/${this.userId}/favorite-diets`)
      : null;

    if (favouriteDiets$) {
      // Handle logged-in users
      forkJoin([diets$, favouriteDiets$]).subscribe({
        next: ([diets, favouriteDiets]) => {
          this.configDietTypes = diets; // Populate available diets
          this.favouriteDiets = favouriteDiets; // Populate favorite diets

          // Set selected diets to favourite diets by default
          this.selectedDiets = this.favouriteDiets.map((diet) => diet.dietType);

          console.log('Diets loaded:', this.configDietTypes);
          console.log('Favourite diets loaded:', this.favouriteDiets);
          console.log('Selected diets (default):', this.selectedDiets);

          // Apply default filter
          this.fetchRecipes();
        },
        error: (err) => {
          console.error('Error loading diets or favorites:', err);
          alert('Failed to load diets. Please try again later.');
        },
      });
    } else {
      // Handle not-logged-in users
      diets$.subscribe({
        next: (diets) => {
          this.configDietTypes = diets; // Populate available diets
          this.selectedDiets = []; // No default selection
          console.log('Diets loaded for guest user:', this.configDietTypes);
        },
        error: (err) => {
          console.error('Error loading diets:', err);
          alert('Failed to load diets. Please try again later.');
        },
      });
    }
  }


}
