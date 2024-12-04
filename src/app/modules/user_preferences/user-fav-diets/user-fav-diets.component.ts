/*
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
 /!* isSaving: boolean = false;*!/
/!**!/
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
*/
import { Component, OnInit } from '@angular/core';
import { UserPreferencesService } from '../services/user-preferences.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Diet } from '../../diet/model/diet';
import { catchError } from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';

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

  /*toggleDietSelection(dietId: number): void {
    if (this.selectedDiets.includes(dietId)) {
      this.selectedDiets = this.selectedDiets.filter((id) => id !== dietId);
    } else {
      this.selectedDiets.push(dietId);
    }
  }*/

  savePreferences(dietId: number): void {
    if (!this.userId) {
      alert('You must be logged in to update your diet preferences.');
      return;
    }

    // Check if the diet is already selected
    const isSelected = this.selectedDiets.includes(dietId);

    if (isSelected) {
      // If selected, remove it and update the local state
      this.selectedDiets = this.selectedDiets.filter((id) => id !== dietId);
      console.log(`Diet ${dietId} removed from preferences.`);

      // Optionally, call the backend API to remove the diet
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
      // If not selected, add it and call the API
      this.selectedDiets.push(dietId);
      console.log(`Diet ${dietId} added to preferences.`);

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


  /*saveDietPreferences(): void {
    // Step 1: Validate user login
    if (!this.userId) {
      alert('You must be logged in to save your preferences.');
      return;
    }

    // Step 2: Check if any diets are selected
    if (this.selectedDiets.length === 0) {
      alert('Please select at least one diet before saving.');
      return;
    }

    // Step 3: Indicate that the saving process has started
    this.isSaving = true;

    // Step 4: Prepare the data to send to the server
    const preferencesUpdate = {
      userId: this.userId,
      dietTypeIds: this.selectedDiets,
    };

    // Step 5: Call the API to save preferences
    this.userPreferencesService.updateFavoriteDiets(preferencesUpdate).subscribe({
      next: () => {
        alert('Your diet preferences have been saved successfully!');
        this.loadPreferences(); // Reload the preferences after saving
      },
      error: (err) => {
        console.error('Error saving preferences:', err);
        alert('Failed to save your preferences. Please try again.');
      },
      complete: () => {
        // Step 6: Reset saving state regardless of success or failure
        this.isSaving = false;
      },
    });
  }*/


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
      return; // If user cancels, exit the function
    }

    const removalRequests = this.selectedDiets.map((dietId) =>
      this.userPreferencesService.removeFavoriteDiet(this.userId!, dietId)
    );

    // Use forkJoin to wait for all removal requests to complete
    forkJoin(removalRequests)
      .pipe(
        catchError((error) => {
          console.error('Error resetting diet preferences:', error);
          alert('Failed to reset your diet preferences. Please try again.');
          return of([]); // Return an empty array to safely handle errors
        })
      )
      .subscribe({
        next: () => {
          alert('All diet preferences have been successfully removed.');
          this.selectedDiets = []; // Clear the selected diets
          this.favoriteDiets = []; // Clear favorite diets in the UI
        },
        error: (err) => {
          console.error('Error during reset process:', err);
          alert('An error occurred while resetting preferences. Please try again.');
        },
      });
  }

}



