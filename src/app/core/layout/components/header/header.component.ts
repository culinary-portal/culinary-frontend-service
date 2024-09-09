import { Component, OnInit } from '@angular/core';
import { MENU } from 'src/app/shared/constant';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    .top-nav-menu,
    .bottom-nav-menu {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .top-nav-menu-item a,
    .top-nav-menu-item button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      font-size: 1.3rem;
      text-transform: uppercase;
      transition: all 0.5s;
    }

    .bottom-nav-menu-item a:hover {
      font-weight: 600;
      border-bottom: 4px solid #374151;
    }

    .active-link {
      font-weight: 600;
      border-bottom: 4px solid #374151;
    }
  `]
})
export class HeaderComponent implements OnInit {
  menuList: { title: string; path: string }[] = MENU;
  isMenu = false;
  userDetails: UserDetailsDTO | null = null;  // Store user details

  constructor(public authService: AuthService) {}

  openMenu() {
    this.isMenu = true;
  }

  closeMenu() {
    this.isMenu = false;
  }

  logOut() {
    this.authService.logout();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Fetch user details from AuthService
      this.userDetails = this.authService.getUserDetails();
    }
  }
}
