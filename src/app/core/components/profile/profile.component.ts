import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { Option } from 'src/app/modules/user/model/options';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: UserDetailsDTO;
  isLoading = true;
  error: string | null = null;

  options: Option[] = []; // Use the Option model

  constructor(private userService: UserService,
              private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const userDetails = this.authService.getUserDetails();
    if (userDetails?.id) {
      this.userService.getUserDetails(userDetails.id).subscribe({
        next: (userDetails) => {
          this.user = userDetails;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load user details.';
          console.error(err);
          this.isLoading = false;
        },
      });
    } else {
      // Handle case where userDetails is null or id is missing
      this.error = 'User ID is missing. Please log in again.';
      this.authService.logout();
    }

    this.options = [
      {id: 1, label: 'Favourite Recipes', icon: 'fa-solid fa-egg', route: '/favorite-recipes'},
      {id: 2, label: 'My Modifications', icon: 'fa-solid fa-edit', route: '/my-modifications'},
      {id: 3, label: 'My Favourite Diets', icon: 'fa-solid fa-utensils', route: '/favorite-diets'},
      {id: 4, label: 'Settings', icon: 'fa-solid fa-cog', route: '/settings'},
    ];


  }
}

