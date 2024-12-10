import { Component, OnInit } from '@angular/core';
import { UserPreferencesService } from '../services/user-preferences.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Diet } from '../../diet/model/diet';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-fav-diets.component.html',
  styleUrls: ['./user-fav-diets.component.scss'],
})
export class UserFavDietsComponent implements OnInit {
  favoriteDiets: Diet[] = [];
  availableDiets: Diet[] = [];
  selectedDiets: number[] = [];
  userId: number | null = null;
  isSaving: boolean = false;

  constructor(
    private userPreferencesService: UserPreferencesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.id) {
      this.userId = userDetails.id;
      this.loadPreferences();
      this.loadAvailableDiets(); // Dynamically fetch available diets
    } else {
      console.error('User details not available! Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  loadPreferences(): void {
    if (!this.userId) {
      console.error('Cannot load preferences: User ID is missing.');
      return;
    }

    this.userPreferencesService.getFavoriteDiets(this.userId).subscribe(
      (data: Diet[]) => {
        this.favoriteDiets = data;
        this.selectedDiets = data.map((diet: Diet) => diet.dietTypeId);
      },
      (error: any) => console.error('Error fetching favorite diets:', error)
    );
  }

  /*loadAvailableDiets(): void {
    this.userPreferencesService.getAllDiets().subscribe(
      /!*(data: Diet[]) => {
        this.availableDiets = data;
      },*!/
      (data: Diet[]) => {
        this.availableDiets = data.map((diet) => ({
          ...diet,
          icon: this.getDietIcon(diet.dietType), // Assign icon
        }));
      },
      (error: any) => {
        console.error('Error fetching available diets:', error);
        alert('Failed to load available diets. Please try again later.');
      }
    );
  }*/

  loadAvailableDiets(): void {
    this.userPreferencesService.getAllDiets().subscribe(
      (data: Diet[]) => {
        console.log('Received diet data:', data); // Debugging line
        this.availableDiets = data.map((diet) => ({
          ...diet,
          icon: this.getDietIcon(diet.dietType), // Assign icon
        }));
      },
      (error: any) => {
        console.error('Error fetching available diets:', error);
        alert('Failed to load available diets. Please try again later.');
      }
    );
  }


  getDietIcon(dietType: string): string {
    const iconMap: { [key: string]: string } = {
      'LACTOSE-FREE': 'fas fa-glass-whiskey',
      'GLUTEN-FREE': 'fas fa-bread-slice',
      'VEGAN': 'fas fa-leaf',
      'VEGETARIAN': 'fas fa-carrot',
      'KETO': 'fas fa-bacon',
    };

    // Normalize the dietType string
    const normalizedDietType = dietType.trim().toUpperCase();

    // Return the corresponding icon or the default
    return iconMap[normalizedDietType] || 'fas fa-utensils';
  }



  savePreferences(dietId: number): void {
    if (!this.userId) {
      alert('You must be logged in to update your diet preferences.');
      return;
    }

    const isSelected = this.selectedDiets.includes(dietId);

    if (isSelected) {
      this.selectedDiets = this.selectedDiets.filter((id) => id !== dietId);
      this.userPreferencesService.removeFavoriteDiet(this.userId, dietId).subscribe({
        next: () => {
          console.log(`Diet ${dietId} successfully removed from favorites.`);
        },
        error: (err) => {
          console.error(`Failed to remove diet ${dietId} from favorites:`, err);
          alert('Failed to remove the diet. Please try again.');
        },
      });
    } else {
      this.selectedDiets.push(dietId);
      this.userPreferencesService.addFavoriteDiet(this.userId, dietId).subscribe({
        next: () => {
          console.log(`Diet ${dietId} successfully added to favorites.`);
        },
        error: (err) => {
          console.error(`Failed to add diet ${dietId} to favorites:`, err);
          alert('Failed to add the diet. Please try again.');
        },
      });
    }
  }

  resetDietPreferences(): void {
    if (!this.userId) {
      alert('You must be logged in to reset your diet preferences.');
      return;
    }

    if (this.selectedDiets.length === 0) {
      alert('You have no diet preferences to reset.');
      return;
    }

    const confirmReset = confirm(
      'Are you sure you want to remove all your liked diets? This action cannot be undone.'
    );

    if (!confirmReset) {
      return;
    }

    const removalRequests = this.selectedDiets.map((dietId) =>
      this.userPreferencesService.removeFavoriteDiet(this.userId!, dietId)
    );

    forkJoin(removalRequests)
      .pipe(
        catchError((error) => {
          console.error('Error resetting diet preferences:', error);
          alert('Failed to reset your diet preferences. Please try again.');
          return of([]);
        })
      )
      .subscribe({
        next: () => {
          alert('All diet preferences have been successfully removed.');
          this.selectedDiets = [];
          this.favoriteDiets = [];
        },
        error: (err) => {
          console.error('Error during reset process:', err);
          alert('An error occurred while resetting preferences. Please try again.');
        },
      });
  }
}
