// settings.component.ts
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserPreferencesService } from '../services/user-preferences.service';
import { Component } from '@angular/core';
import { UserDetailsDTO } from '../../user/model/user-details';
import {AuthService} from "../../../shared/services/auth/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../user/services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settingsForm: FormGroup;
  user!: UserDetailsDTO;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService,
              private userPService: UserPreferencesService, private authService: AuthService) {
    // Initialize the form
    this.settingsForm = this.fb.group({
      email: [''],
      userName: [''],
      photoUrl: [''],
      birthdate: [''],
    });

    this.loadUserDetails(); // Preload user details if needed
  }


  ngOnInit(): void {
    this.loadUserDetails();
  }

  getUserId(): number | undefined {
    return <number>this.authService.getUserDetails()?.id;
  }


  loadUserDetails(): void {
    const userDetails = this.authService.getUserDetails();
    this.userPService.getUserDetails(userDetails?.id).subscribe({
      next: (user: UserDetailsDTO) => {
        this.settingsForm.patchValue({
          email: user.email,
          userName: user.userName,
          photoUrl: user.photoUrl,
          birthdate: user.birthdate
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user details. Please try again.';
        console.error('Error loading user details:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      const isConfirmed = window.confirm('Are you sure you want to save the changes?');

      if (isConfirmed) {
        const userId = this.getUserId(); // Fetch the dynamic user ID

        const userDetails: Partial<UserDetailsDTO> = {
          id: userId, // Always include the user ID
          email: this.settingsForm.value.email,
          userName: this.settingsForm.value.userName,
          photoUrl: this.settingsForm.value.photoUrl, // Include photoUrl
          birthdate: this.settingsForm.value.birthdate
        };

        console.log('Payload to save:', userDetails);

        if (typeof userId === "number") {
          this.userPService.updateUser(userId, userDetails).subscribe({
            next: (response) => {
              console.log('Response:', response);
              this.authService.setUserDetails(response);
              this.successMessage = 'Profile updated successfully!';
              this.errorMessage = '';
            },
            error: (error) => {
              console.error('Error updating user:', error);
              this.errorMessage = 'Failed to update profile. Please try again.';
              this.successMessage = '';
            }
          });
        }
      } else {
        console.log('User canceled the save action.');
      }
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
      this.successMessage = '';
      this.settingsForm.markAllAsTouched(); // Highlight invalid fields
    }
  }


}
