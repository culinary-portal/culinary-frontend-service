import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details';

interface AuthDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userDetails: UserDetailsDTO | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  register(registerDTO: RegisterDTO) {
    return this.http.post('/api/auth/register', registerDTO, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 201) {
          return response.body || {};
        } else {
          throw new Error('Unexpected response status: ' + response.status);
        }
      })
    );
  }

  login(authDTO: AuthDTO) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserDetailsDTO>('/api/auth/login', authDTO, { headers }).pipe(
      tap((userDetails: UserDetailsDTO) => {
        this.setUserDetails(userDetails); // Set user details
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    this.clearUserDetails();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('userDetails');
  }

  private setUserDetails(userDetails: UserDetailsDTO) {
    this.userDetails = userDetails;
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    localStorage.setItem('isLogged', 'true');
  }

  private clearUserDetails() {
    this.userDetails = null;
    localStorage.removeItem('userDetails');
    localStorage.removeItem('isLogged');
  }

  getUserDetails() {
    if (!this.userDetails) {
      const storedUser = localStorage.getItem('userDetails');
      if (storedUser) {
        this.userDetails = JSON.parse(storedUser);
      }
    }
    return this.userDetails;
  }
}
