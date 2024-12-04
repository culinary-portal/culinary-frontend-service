import { Component, OnInit } from '@angular/core';
import { UserPreferencesService } from '../services/user-preferences.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Diet } from '../../diet/model/diet';
import {forkJoin, of, switchMap} from 'rxjs';
import {catchError} from "rxjs/operators";

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

    this.availableDiets = [
      { dietTypeId: 1, dietType: 'Vegan' },
      { dietTypeId: 2, dietType: 'Vegetarian' },
      { dietTypeId: 3, dietType: 'Gluten-free' },
      { dietTypeId: 4, dietType: 'No-lactose' },
      { dietTypeId: 5, dietType: 'Keto' },
    ];
  }

  isFavoriteDiet(dietId: number): boolean {
    return this.selectedDiets.includes(dietId);
  }

  toggleDietSelection(dietId: number, isSelected: boolean): void {
    if (isSelected) {
      if (!this.selectedDiets.includes(dietId)) {
        this.selectedDiets.push(dietId);
      }
    } else {
      this.selectedDiets = this.selectedDiets.filter((id) => id !== dietId);
    }
  }

  saveDietPreferences(): void {
    if (!this.userId) {
      alert('User is not logged in or user details are missing.');
      return;
    }

    if (this.selectedDiets.length === 0) {
      alert('Please select at least one diet before saving.');
      return;
    }

    const preferencesUpdate = {
      userId: this.userId,
      dietTypeIds: this.selectedDiets, // Send all selected diets
    };

    this.userPreferencesService.updateFavoriteDiets(preferencesUpdate).subscribe({
      next: () => {
        alert('Diet preferences saved successfully!');
        this.loadPreferences(); // Refresh preferences after saving
      },
      error: (err) => {
        console.error('Error saving diet preferences:', err);
        alert('Failed to save diet preferences. Please try again.');
      },
    });
  }


  resetDietPreferences(): void {
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }

    // Clear the selected diets
    this.selectedDiets = [];

    // Reload the available diets to reflect the reset state
    this.loadPreferences();

    // Notify the user
    alert('All diet preferences have been reset!');
  }
}
